// Sdílené mezi vitest.config.ts, globálním nastavením a testy.
// Testovací databáze je oddělená od vývojové; adresu lze přepsat proměnnou TEST_DATABASE_URL.
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://selfplan:selfplan@localhost:5432/selfplan_test';

// Rychlý Argon2 jen pro testy. Ostrý běh používá výchozí hodnoty z env.ts (minimum OWASP).
export const TEST_ENV: Record<string, string> = {
  NODE_ENV: 'test',
  DATABASE_URL: TEST_DATABASE_URL,
  CORS_ORIGIN: 'http://localhost:3000',
  SESSION_COOKIE_SECURE: 'false',
  ARGON2_MEMORY_KIB: '8',
  ARGON2_TIME_COST: '1',
  ARGON2_PARALLELISM: '1',
};
