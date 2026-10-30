// Sdílené mezi vitest.config.mts, globálním nastavením a testy.
// Správcovská adresa (superuživatel) slouží jen k přípravě testovací databáze a k mazání dat mezi testy.
// Adresu lze přepsat proměnnou TEST_DATABASE_URL (např. jiný port, pokud je 5432 obsazený).
export const TEST_ADMIN_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://selfplan:selfplan@localhost:5432/selfplan_test';

export const TEST_MIGRATOR_ROLE = 'selfplan_migrator';
export const TEST_APP_ROLE = 'selfplan_app';
// Hesla testovacích rolí. Platí jen pro tuto testovací databázi, která se při každém spuštění vytvoří znovu.
export const TEST_MIGRATOR_PASSWORD = 'test-migrator-password';
export const TEST_APP_PASSWORD = 'test-app-password';

function withCredentials(user: string, password: string): string {
  const url = new URL(TEST_ADMIN_DATABASE_URL);
  url.username = user;
  url.password = password;
  return url.toString();
}

export const TEST_MIGRATOR_DATABASE_URL = withCredentials(TEST_MIGRATOR_ROLE, TEST_MIGRATOR_PASSWORD);
export const TEST_APP_DATABASE_URL = withCredentials(TEST_APP_ROLE, TEST_APP_PASSWORD);

// API se v testech připojuje pod stejnou omezenou rolí jako v produkci, takže chybějící oprávnění se projeví.
// Rychlý Argon2 jen pro testy; ostrý běh používá výchozí hodnoty z env.ts (minimum OWASP).
export const TEST_ENV: Record<string, string> = {
  NODE_ENV: 'test',
  DATABASE_URL: TEST_APP_DATABASE_URL,
  CORS_ORIGIN: 'http://localhost:3000',
  SESSION_COOKIE_SECURE: 'false',
  ARGON2_MEMORY_KIB: '8',
  ARGON2_TIME_COST: '1',
  ARGON2_PARALLELISM: '1',
};
