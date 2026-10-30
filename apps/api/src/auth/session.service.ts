import { Inject, Injectable } from '@nestjs/common';
import { Clock } from '../common/clock';
import { APP_CONFIG, type AppConfig } from '../config/app-config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthEventsService } from './auth-events.service';
import type { AuthenticateResult, SessionMeta } from './auth.types';
import { evaluateSession } from './session.policy';
import { generateToken, hashToken } from './token';

// Zápis lastSeenAt se omezuje, aby běžný požadavek nevyvolal zápis do DB.
const TOUCH_INTERVAL_MS = 60_000;
// Nahrazené tokeny se uchovávají kvůli detekci opakovaného použití; starší se mažou.
const SUPERSEDED_RETENTION_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
    private readonly events: AuthEventsService,
    @Inject(APP_CONFIG) private readonly cfg: AppConfig,
  ) {}

  async create(userId: string, meta: SessionMeta): Promise<{ token: string; sessionId: string; expiresAt: Date }> {
    const now = this.clock.now();
    const token = generateToken();
    const absoluteExpiresAt = new Date(now.getTime() + this.cfg.session.absoluteMs);
    const session = await this.prisma.session.create({
      data: {
        userId,
        createdAt: now,
        lastSeenAt: now,
        idleExpiresAt: this.slide(now, absoluteExpiresAt),
        absoluteExpiresAt,
        ip: meta.ip,
        userAgent: meta.userAgent,
        tokens: { create: { tokenHash: hashToken(token), createdAt: now } },
      },
    });
    return { token, sessionId: session.id, expiresAt: absoluteExpiresAt };
  }

  async authenticate(
    token: string,
    meta: SessionMeta,
    opts: { forceRotate?: boolean } = {},
  ): Promise<AuthenticateResult> {
    const tokenHash = hashToken(token);
    const row = await this.prisma.sessionToken.findUnique({
      where: { tokenHash },
      include: { session: { include: { user: true } } },
    });
    if (!row) return { ok: false, reason: 'unknown' };

    const { session } = row;
    const now = this.clock.now();
    const decision = evaluateSession(session, row, now, this.cfg.session, opts);

    if (decision.kind === 'invalid') {
      if (decision.reason !== 'revoked') {
        await this.revoke(session.id, decision.reason);
        await this.events.record(`session_${decision.reason}`, meta, session.userId, now);
      }
      return { ok: false, reason: decision.reason };
    }

    if (decision.kind === 'reuse') {
      await this.revoke(session.id, 'reuse_detected');
      await this.events.record('session_reuse_detected', meta, session.userId, now);
      return { ok: false, reason: 'reuse' };
    }

    if (session.user.status !== 'ACTIVE') {
      await this.revoke(session.id, 'user_suspended');
      return { ok: false, reason: 'revoked' };
    }

    let rotatedToken: string | undefined;
    if (decision.rotate) {
      rotatedToken = await this.rotate(session.id, tokenHash, session.absoluteExpiresAt, now);
      if (rotatedToken) await this.events.record('session_rotated', meta, session.userId, now);
    } else if (!decision.viaSuperseded && now.getTime() - session.lastSeenAt.getTime() >= TOUCH_INTERVAL_MS) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { lastSeenAt: now, idleExpiresAt: this.slide(now, session.absoluteExpiresAt) },
      });
    }

    return {
      ok: true,
      session: {
        sessionId: session.id,
        user: { id: session.user.id, email: session.user.email, emailVerifiedAt: session.user.emailVerifiedAt },
        expiresAt: session.absoluteExpiresAt,
        rotatedToken,
      },
    };
  }

  // Vrací nový token, nebo undefined, pokud rotaci mezitím provedl souběžný požadavek.
  private async rotate(
    sessionId: string,
    oldHash: string,
    absoluteExpiresAt: Date,
    now: Date,
  ): Promise<string | undefined> {
    const newToken = generateToken();
    const rotated = await this.prisma.$transaction(async (tx) => {
      const superseded = await tx.sessionToken.updateMany({
        where: { tokenHash: oldHash, supersededAt: null },
        data: { supersededAt: now },
      });
      if (superseded.count !== 1) return false;
      await tx.sessionToken.create({ data: { tokenHash: hashToken(newToken), sessionId, createdAt: now } });
      await tx.sessionToken.deleteMany({
        where: { sessionId, supersededAt: { lt: new Date(now.getTime() - SUPERSEDED_RETENTION_MS) } },
      });
      await tx.session.update({
        where: { id: sessionId },
        data: { lastSeenAt: now, idleExpiresAt: this.slide(now, absoluteExpiresAt) },
      });
      return true;
    });
    return rotated ? newToken : undefined;
  }

  async revoke(sessionId: string, reason: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: this.clock.now(), revokedReason: reason },
    });
  }

  // Zneplatní relaci podle tokenu bez ohledu na jeho stav. Vrací ID relace a uživatele, pokud token existuje.
  async revokeByToken(token: string, reason: string): Promise<{ sessionId: string; userId: string } | null> {
    const row = await this.prisma.sessionToken.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { session: true },
    });
    if (!row) return null;
    await this.revoke(row.sessionId, reason);
    return { sessionId: row.sessionId, userId: row.session.userId };
  }

  async revokeOthers(userId: string, exceptSessionId: string, reason: string): Promise<number> {
    const result = await this.prisma.session.updateMany({
      where: { userId, id: { not: exceptSessionId }, revokedAt: null },
      data: { revokedAt: this.clock.now(), revokedReason: reason },
    });
    return result.count;
  }

  // Posuvná expirace při nečinnosti, nikdy za absolutní limit.
  private slide(now: Date, absoluteExpiresAt: Date): Date {
    return new Date(Math.min(now.getTime() + this.cfg.session.idleMs, absoluteExpiresAt.getTime()));
  }
}
