import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Clock } from '../common/clock';
import { APP_CONFIG, type AppConfig } from '../config/app-config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthEventsService } from './auth-events.service';
import type { LoginInput, RegisterInput } from './auth.dto';
import type { SessionMeta, SessionUser } from './auth.types';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';

export interface LoginResult {
  user: SessionUser;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly sessions: SessionService,
    private readonly events: AuthEventsService,
    private readonly clock: Clock,
    @Inject(APP_CONFIG) private readonly cfg: AppConfig,
  ) {}

  // Odpověď je vždy stejná, ať e-mail existuje nebo ne (ochrana proti výčtu účtů).
  // Hašování se provádí v obou případech, aby se nelišila ani doba odpovědi.
  async register(input: RegisterInput, meta: SessionMeta): Promise<void> {
    const passwordHash = await this.passwords.hash(input.password);
    try {
      const user = await this.prisma.user.create({
        data: { email: input.email, identities: { create: { provider: 'LOCAL', passwordHash } } },
      });
      await this.events.record('register_success', meta, user.id);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        await this.events.record('register_duplicate', meta);
        return;
      }
      throw err;
    }
  }

  async login(input: LoginInput, meta: SessionMeta): Promise<LoginResult> {
    const now = this.clock.now();
    const identity = await this.prisma.authIdentity.findFirst({
      where: { provider: 'LOCAL', user: { email: input.email } },
      include: { user: true },
    });

    const locked = identity?.lockedUntil != null && identity.lockedUntil.getTime() > now.getTime();
    const usable = identity?.passwordHash != null && identity.user.status === 'ACTIVE' && !locked;

    if (!identity || !identity.passwordHash || !usable) {
      await this.passwords.verifyDummy(input.password);
      await this.events.record(locked ? 'login_locked' : 'login_failure', meta, identity?.userId, now);
      throw this.invalidCredentials();
    }

    const valid = await this.passwords.verify(identity.passwordHash, input.password);
    if (!valid) {
      await this.registerFailure(identity.id, identity.failedLogins + 1, now);
      await this.events.record('login_failure', meta, identity.userId, now);
      throw this.invalidCredentials();
    }

    if (identity.failedLogins > 0 || identity.lockedUntil) {
      await this.prisma.authIdentity.update({
        where: { id: identity.id },
        data: { failedLogins: 0, lockedUntil: null },
      });
    }

    const { token, expiresAt } = await this.sessions.create(identity.userId, meta);
    await this.events.record('login_success', meta, identity.userId, now);
    const { id, email, emailVerifiedAt } = identity.user;
    return { user: { id, email, emailVerifiedAt }, token, expiresAt };
  }

  // Po dosažení limitu se účet na dobu zamkne a počítadlo začne znovu.
  private async registerFailure(identityId: string, failures: number, now: Date): Promise<void> {
    const lock = failures >= this.cfg.login.maxFailures;
    await this.prisma.authIdentity.update({
      where: { id: identityId },
      data: lock
        ? { failedLogins: 0, lockedUntil: new Date(now.getTime() + this.cfg.login.lockMs) }
        : { failedLogins: failures },
    });
  }

  private invalidCredentials(): UnauthorizedException {
    return new UnauthorizedException({ message: 'invalid_credentials' });
  }
}
