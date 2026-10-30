// Čistá pravidla platnosti a rotace relace. Bez DB a bez času z okolí, proto snadno testovatelná.

export interface PolicySession {
  revokedAt: Date | null;
  idleExpiresAt: Date;
  absoluteExpiresAt: Date;
}

export interface PolicyToken {
  createdAt: Date;
  supersededAt: Date | null;
}

export interface PolicyConfig {
  rotateMs: number;
  graceMs: number;
}

export type InvalidReason = 'revoked' | 'idle_expired' | 'absolute_expired';

export type PolicyDecision =
  | { kind: 'invalid'; reason: InvalidReason }
  // Nahrazený token použitý po uplynutí odkladu: pravděpodobná krádež, relace se ruší.
  | { kind: 'reuse' }
  | { kind: 'valid'; rotate: boolean; viaSuperseded: boolean };

export function evaluateSession(
  session: PolicySession,
  token: PolicyToken,
  now: Date,
  cfg: PolicyConfig,
  opts: { forceRotate?: boolean } = {},
): PolicyDecision {
  const t = now.getTime();

  if (session.revokedAt) return { kind: 'invalid', reason: 'revoked' };
  if (t >= session.absoluteExpiresAt.getTime()) return { kind: 'invalid', reason: 'absolute_expired' };
  if (t >= session.idleExpiresAt.getTime()) return { kind: 'invalid', reason: 'idle_expired' };

  if (token.supersededAt) {
    // Souběžné požadavky jednoho prohlížeče mohou nést starý token těsně po rotaci.
    const withinGrace = t - token.supersededAt.getTime() <= cfg.graceMs;
    return withinGrace ? { kind: 'valid', rotate: false, viaSuperseded: true } : { kind: 'reuse' };
  }

  const due = t - token.createdAt.getTime() >= cfg.rotateMs;
  return { kind: 'valid', rotate: opts.forceRotate === true || due, viaSuperseded: false };
}
