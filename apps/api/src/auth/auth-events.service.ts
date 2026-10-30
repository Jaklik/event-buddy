import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { SessionMeta } from './auth.types';

export type AuthEventType =
  | 'register_success'
  | 'register_duplicate'
  | 'login_success'
  | 'login_failure'
  | 'login_locked'
  | 'logout'
  | 'logout_others'
  | 'session_rotated'
  | 'session_idle_expired'
  | 'session_absolute_expired'
  | 'session_reuse_detected';

// Bezpečnostní log do DB. Nikdy se do něj nezapisují hesla ani tokeny.
@Injectable()
export class AuthEventsService {
  private readonly logger = new Logger(AuthEventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(type: AuthEventType, meta: SessionMeta, userId?: string | null, at?: Date): Promise<void> {
    try {
      await this.prisma.authEvent.create({
        data: { type, userId: userId ?? null, ip: meta.ip, userAgent: meta.userAgent, createdAt: at },
      });
    } catch (err) {
      // Selhání auditu nesmí zablokovat přihlášení; je ale vidět v logu.
      this.logger.error(`audit event ${type} failed`, err instanceof Error ? err.stack : undefined);
    }
  }
}
