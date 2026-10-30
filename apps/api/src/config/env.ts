import { z } from 'zod';

// Boolean z ENV: pouze přesné řetězce "true" / "false", cokoli jiného je chyba konfigurace.
const flag = (fallback: 'true' | 'false') =>
  z
    .enum(['true', 'false'])
    .default(fallback)
    .transform((v) => v === 'true');

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(4000),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  // Počet reverzních proxy před API (Caddy = 1); potřebné pro správnou IP klienta.
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  // Cookie relace. Secure je výchozí; v lokálním vývoji přes http nastav false.
  SESSION_COOKIE_NAME: z.string().min(1).default('sp_session'),
  SESSION_COOKIE_SECURE: flag('true'),
  SESSION_IDLE_MINUTES: z.coerce.number().int().positive().default(14 * 24 * 60),
  SESSION_ABSOLUTE_MINUTES: z.coerce.number().int().positive().default(30 * 24 * 60),
  SESSION_ROTATE_MINUTES: z.coerce.number().int().positive().default(15),
  SESSION_GRACE_SECONDS: z.coerce.number().int().nonnegative().default(30),

  LOGIN_MAX_FAILURES: z.coerce.number().int().positive().default(5),
  LOGIN_LOCK_MINUTES: z.coerce.number().int().positive().default(15),

  // Argon2id, výchozí hodnoty odpovídají minimu OWASP (19 MiB, 2 průchody, 1 vlákno).
  ARGON2_MEMORY_KIB: z.coerce.number().int().min(8).default(19456),
  ARGON2_TIME_COST: z.coerce.number().int().min(1).default(2),
  ARGON2_PARALLELISM: z.coerce.number().int().min(1).default(1),

  RATE_LIMIT_GLOBAL_PER_MIN: z.coerce.number().int().positive().default(300),
  RATE_LIMIT_AUTH_PER_MIN: z.coerce.number().int().positive().default(10),
}).superRefine((e, ctx) => {
  // Chybové hlášky záměrně neobsahují hodnoty proměnných, aby secrets neunikly do logů.
  const fail = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message });

  for (const origin of e.CORS_ORIGIN.split(',').map((o) => o.trim())) {
    if (!isOrigin(origin)) {
      fail('CORS_ORIGIN', 'každý origin musí mít tvar schéma://host[:port] bez cesty a lomítka na konci; hvězdička není povolena');
    }
  }

  if (e.NODE_ENV !== 'production') return;

  const db = parseUrl(e.DATABASE_URL);
  if (!db) return;
  const password = decodeURIComponent(db.password);
  if (['postgres', 'root', 'admin'].includes(db.username)) {
    fail('DATABASE_URL', 'v produkci se aplikace nesmí připojovat pod účtem postgres, root ani admin');
  }
  if (password.length < 24 || WEAK_PASSWORDS.has(password.toLowerCase())) {
    fail('DATABASE_URL', 'v produkci musí mít heslo databáze alespoň 24 znaků a nesmí být výchozí (openssl rand -hex 24)');
  }
});

export type Env = z.infer<typeof envSchema>;

const WEAK_PASSWORDS = new Set(['selfplan', 'postgres', 'password', 'changeme', 'secret', 'test']);

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

// Origin je přesně schéma://host[:port]. Hvězdička s cookie (credentials) nikdy není bezpečná.
function isOrigin(value: string): boolean {
  const url = parseUrl(value);
  return url !== undefined && ['http:', 'https:'].includes(url.protocol) && url.origin === value;
}

export const env: Env = envSchema.parse(process.env);
