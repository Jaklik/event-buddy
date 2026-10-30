import type { Env } from './env';

export const APP_CONFIG = Symbol('APP_CONFIG');

const MINUTE = 60_000;

// Konfigurace oddělená od process.env, aby ji šlo v testech podstrčit.
export interface AppConfig {
  nodeEnv: Env['NODE_ENV'];
  corsOrigins: string[];
  trustProxy: number;
  cookie: { name: string; secure: boolean };
  session: { idleMs: number; absoluteMs: number; rotateMs: number; graceMs: number };
  login: { maxFailures: number; lockMs: number };
  argon2: { memoryCost: number; timeCost: number; parallelism: number };
  rateLimit: { globalPerMin: number; authPerMin: number };
}

export function loadAppConfig(e: Env): AppConfig {
  return {
    nodeEnv: e.NODE_ENV,
    corsOrigins: e.CORS_ORIGIN.split(',').map((o) => o.trim()),
    trustProxy: e.TRUST_PROXY,
    cookie: {
      // Prefix __Host- vynucuje Secure, Path=/ a zákaz atributu Domain.
      name: e.SESSION_COOKIE_SECURE ? `__Host-${e.SESSION_COOKIE_NAME}` : e.SESSION_COOKIE_NAME,
      secure: e.SESSION_COOKIE_SECURE,
    },
    session: {
      idleMs: e.SESSION_IDLE_MINUTES * MINUTE,
      absoluteMs: e.SESSION_ABSOLUTE_MINUTES * MINUTE,
      rotateMs: e.SESSION_ROTATE_MINUTES * MINUTE,
      graceMs: e.SESSION_GRACE_SECONDS * 1000,
    },
    login: { maxFailures: e.LOGIN_MAX_FAILURES, lockMs: e.LOGIN_LOCK_MINUTES * MINUTE },
    argon2: {
      memoryCost: e.ARGON2_MEMORY_KIB,
      timeCost: e.ARGON2_TIME_COST,
      parallelism: e.ARGON2_PARALLELISM,
    },
    rateLimit: { globalPerMin: e.RATE_LIMIT_GLOBAL_PER_MIN, authPerMin: e.RATE_LIMIT_AUTH_PER_MIN },
  };
}
