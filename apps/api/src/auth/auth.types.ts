import type { Request } from 'express';

export interface SessionMeta {
  ip: string | null;
  userAgent: string | null;
}

export interface SessionUser {
  id: string;
  email: string;
  emailVerifiedAt: Date | null;
}

export interface AuthenticatedSession {
  sessionId: string;
  user: SessionUser;
  // Absolutní konec relace, slouží jako expirace cookie.
  expiresAt: Date;
  // Vyplněno jen při rotaci; nový token se musí poslat klientovi v cookie.
  rotatedToken?: string;
}

export type SessionFailure = 'unknown' | 'revoked' | 'idle_expired' | 'absolute_expired' | 'reuse';

export type AuthenticateResult =
  | { ok: true; session: AuthenticatedSession }
  | { ok: false; reason: SessionFailure };

export interface AuthedRequest extends Request {
  auth: AuthenticatedSession;
}

export function sessionMeta(req: Request): SessionMeta {
  const ua = req.headers['user-agent'];
  return { ip: req.ip ?? null, userAgent: typeof ua === 'string' ? ua.slice(0, 255) : null };
}
