import { describe, expect, it } from 'vitest';
import { loadAppConfig } from './app-config';
import { envSchema } from './env';

const MIN = 60_000;
const DAY = 24 * 60 * MIN;
const parse = (extra: Record<string, string> = {}) =>
  envSchema.parse({ DATABASE_URL: 'postgresql://u:p@localhost:5432/db', ...extra });

describe('výchozí konfigurace je bezpečná', () => {
  const cfg = loadAppConfig(parse());

  it('cookie je Secure a používá prefix __Host-', () => {
    expect(cfg.cookie).toEqual({ name: '__Host-sp_session', secure: true });
  });

  it('Argon2id má minimální doporučené parametry OWASP', () => {
    expect(cfg.argon2).toEqual({ memoryCost: 19456, timeCost: 2, parallelism: 1 });
  });

  it('relace: 14 dní nečinnosti, 30 dní absolutně, rotace po 15 minutách, odklad 30 s', () => {
    expect(cfg.session).toEqual({ idleMs: 14 * DAY, absoluteMs: 30 * DAY, rotateMs: 15 * MIN, graceMs: 30_000 });
  });

  it('zamčení po 5 pokusech na 15 minut', () => {
    expect(cfg.login).toEqual({ maxFailures: 5, lockMs: 15 * MIN });
  });

  it('nevěří žádné proxy, dokud to není výslovně nastaveno', () => {
    expect(cfg.trustProxy).toBe(0);
  });

  it('rate limit je zapnutý', () => {
    expect(cfg.rateLimit).toEqual({ globalPerMin: 300, authPerMin: 10 });
  });
});

describe('konfigurace', () => {
  it('bez Secure se cookie nepředřazuje prefix __Host-', () => {
    const cfg = loadAppConfig(parse({ SESSION_COOKIE_SECURE: 'false' }));
    expect(cfg.cookie).toEqual({ name: 'sp_session', secure: false });
  });

  it('boolean přijímá jen "true" a "false"', () => {
    expect(() => parse({ SESSION_COOKIE_SECURE: 'yes' })).toThrow();
    expect(() => parse({ SESSION_COOKIE_SECURE: '0' })).toThrow();
  });

  it('odmítne nesmyslné hodnoty', () => {
    expect(() => parse({ SESSION_IDLE_MINUTES: '0' })).toThrow();
    expect(() => parse({ SESSION_ROTATE_MINUTES: '-5' })).toThrow();
    expect(() => parse({ LOGIN_MAX_FAILURES: 'abc' })).toThrow();
    expect(() => parse({ ARGON2_MEMORY_KIB: '1' })).toThrow();
    expect(() => envSchema.parse({})).toThrow(); // chybí DATABASE_URL
  });

  it('CORS_ORIGIN může obsahovat víc originů oddělených čárkou', () => {
    const cfg = loadAppConfig(parse({ CORS_ORIGIN: 'https://a.example.cz, https://b.example.cz' }));
    expect(cfg.corsOrigins).toEqual(['https://a.example.cz', 'https://b.example.cz']);
  });
});
