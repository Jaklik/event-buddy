import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { type AuthedRequest, sessionMeta } from './auth.types';
import { SessionCookie } from './session-cookie.service';
import { SessionService } from './session.service';

const FORCE_ROTATE = 'auth:forceRotate';

// Vynutí rotaci tokenu při každém volání dané route (endpoint refresh).
export const ForceRotate = () => SetMetadata(FORCE_ROTATE, true);

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessions: SessionService,
    private readonly cookie: SessionCookie,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<AuthedRequest>();
    const res = http.getResponse<Response>();

    const token = this.cookie.read(req);
    if (!token) throw new UnauthorizedException({ message: 'unauthenticated' });

    const forceRotate = this.reflector.getAllAndOverride<boolean>(FORCE_ROTATE, [
      context.getHandler(),
      context.getClass(),
    ]);
    const result = await this.sessions.authenticate(token, sessionMeta(req), { forceRotate: forceRotate === true });

    if (!result.ok) {
      this.cookie.clear(res);
      // Důvod selhání se klientovi neprozrazuje.
      throw new UnauthorizedException({ message: 'unauthenticated' });
    }

    if (result.session.rotatedToken) {
      this.cookie.set(res, result.session.rotatedToken, result.session.expiresAt);
    }
    req.auth = result.session;
    return true;
  }
}
