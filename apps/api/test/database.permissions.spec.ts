import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { TEST_APP_DATABASE_URL, TEST_APP_ROLE } from './test-env';

// Ověřuje, že aplikační role má jen oprávnění, která potřebuje. Kdyby API trpělo SQL injekcí,
// útočník by neměl být schopen měnit schéma, číst systémové tabulky ani spouštět příkazy na serveru.
let app: PrismaClient;
beforeAll(() => {
  app = new PrismaClient({ datasources: { db: { url: TEST_APP_DATABASE_URL } } });
});
afterAll(() => app.$disconnect());

const denied = (sql: string) => expect(app.$executeRawUnsafe(sql)).rejects.toThrow(/permission denied|must be/i);

describe('databázová role aplikace', () => {
  it('není superuživatel a nemá žádná zvláštní oprávnění', async () => {
    const [role] = await app.$queryRaw<
      { current_user: string; rolsuper: boolean; rolcreaterole: boolean; rolcreatedb: boolean; rolreplication: boolean; rolbypassrls: boolean }[]
    >`SELECT current_user, rolsuper, rolcreaterole, rolcreatedb, rolreplication, rolbypassrls FROM pg_roles WHERE rolname = current_user`;
    expect(role).toEqual({
      current_user: TEST_APP_ROLE,
      rolsuper: false,
      rolcreaterole: false,
      rolcreatedb: false,
      rolreplication: false,
      rolbypassrls: false,
    });
  });

  it('smí číst a zapisovat data', async () => {
    await expect(app.$queryRawUnsafe('SELECT count(*) FROM "User"')).resolves.toBeDefined();
    await expect(
      app.$executeRawUnsafe(`INSERT INTO "AuthEvent" ("id", "type") VALUES (gen_random_uuid(), 'permissions_test')`),
    ).resolves.toBe(1);
    await expect(app.$executeRawUnsafe(`UPDATE "AuthEvent" SET "type" = 'x' WHERE "type" = 'permissions_test'`)).resolves.toBe(1);
    await expect(app.$executeRawUnsafe(`DELETE FROM "AuthEvent" WHERE "type" = 'x'`)).resolves.toBe(1);
  });

  it('nesmí měnit schéma', async () => {
    await denied('CREATE TABLE "Injected" (id int)');
    await denied('DROP TABLE "User" CASCADE');
    await denied('ALTER TABLE "User" ADD COLUMN injected text');
    await denied('CREATE INDEX injected_idx ON "User" ("email")');
    await denied('CREATE SCHEMA injected');
    await denied('CREATE FUNCTION injected() RETURNS int LANGUAGE sql AS $$ SELECT 1 $$');
  });

  it('nesmí hromadně mazat tabulky ani rušit databázi', async () => {
    await denied('TRUNCATE "User" CASCADE');
    await denied('DROP DATABASE selfplan_test');
  });

  it('nemůže sobě ani ostatním přidat oprávnění', async () => {
    // GRANT bez práva předávat oprávnění Postgres neodmítne chybou, jen nic nezmění (vydá varování).
    await app.$executeRawUnsafe(`GRANT ALL ON "User" TO PUBLIC`);
    await app.$executeRawUnsafe(`GRANT ALL ON "User" TO ${TEST_APP_ROLE}`);

    const [{ truncate }] = await app.$queryRaw<{ truncate: boolean }[]>`
      SELECT has_table_privilege(current_user, '"User"', 'TRUNCATE') AS truncate`;
    const [{ publicGrants }] = await app.$queryRaw<{ publicGrants: number }[]>`
      SELECT count(*)::int AS "publicGrants" FROM information_schema.role_table_grants
      WHERE grantee = 'PUBLIC' AND table_schema = 'public'`;
    expect(truncate).toBe(false);
    expect(publicGrants).toBe(0);
  });

  it('nesmí číst hesla rolí ani spravovat role', async () => {
    await denied('SELECT * FROM pg_authid');
    await denied(`CREATE ROLE injected LOGIN PASSWORD 'x'`);
    await denied(`ALTER ROLE ${TEST_APP_ROLE} SUPERUSER`);
  });

  it('nesmí spouštět příkazy ani číst soubory na serveru', async () => {
    await denied(`COPY (SELECT 1) TO PROGRAM 'id'`);
    await denied(`COPY "User" TO '/tmp/users.csv'`);
    await denied(`SELECT pg_read_file('/etc/passwd')`);
    await denied(`CREATE EXTENSION IF NOT EXISTS file_fdw`);
  });

  it('dlouhé dotazy se přerušují po 30 sekundách', async () => {
    const [setting] = await app.$queryRaw<{ statement_timeout: string; idle_in_transaction_session_timeout: string }[]>`
      SELECT current_setting('statement_timeout') AS statement_timeout,
             current_setting('idle_in_transaction_session_timeout') AS idle_in_transaction_session_timeout`;
    expect(setting).toEqual({ statement_timeout: '30s', idle_in_transaction_session_timeout: '1min' });
  });

  it('nemá právo připojit se k systémovým databázím', async () => {
    const [{ datname }] = await app.$queryRaw<{ datname: string }[]>`SELECT current_database() AS datname`;
    expect(datname).toBe('selfplan_test');

    const rows = await app.$queryRaw<{ datname: string; canConnect: boolean }[]>`
      SELECT datname, has_database_privilege(current_user, datname, 'CONNECT') AS "canConnect"
      FROM pg_database WHERE datname IN ('postgres', 'template1') ORDER BY datname`;
    expect(rows).toEqual([
      { datname: 'postgres', canConnect: false },
      { datname: 'template1', canConnect: false },
    ]);
  });
});
