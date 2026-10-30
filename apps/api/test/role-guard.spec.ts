import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { assertRestrictedRole } from '../src/prisma/role-guard';
import { TEST_ADMIN_DATABASE_URL, TEST_APP_DATABASE_URL, TEST_MIGRATOR_DATABASE_URL } from './test-env';

const client = (url: string) => new PrismaClient({ datasources: { db: { url } } });
let admin: PrismaClient;
let migrator: PrismaClient;
let app: PrismaClient;

beforeAll(() => {
  admin = client(TEST_ADMIN_DATABASE_URL);
  migrator = client(TEST_MIGRATOR_DATABASE_URL);
  app = client(TEST_APP_DATABASE_URL);
});
afterAll(async () => {
  await Promise.all([admin.$disconnect(), migrator.$disconnect(), app.$disconnect()]);
});

describe('assertRestrictedRole', () => {
  it('projde pro aplikační roli', async () => {
    await expect(assertRestrictedRole(app)).resolves.toBeUndefined();
  });

  it('odmítne superuživatele a pojmenuje nadměrná oprávnění', async () => {
    await expect(assertRestrictedRole(admin)).rejects.toThrow(/rolsuper/);
  });

  it('roli migrator (vlastní schéma) pro API nepovažuje za problém, jen superuživatele a správce rolí', async () => {
    // Migrator nemá žádný z kontrolovaných atributů; přístup ke schématu mu dává vlastnictví databáze.
    await expect(assertRestrictedRole(migrator)).resolves.toBeUndefined();
  });

  it('hláška nezmiňuje heslo ani adresu databáze', async () => {
    const message = await assertRestrictedRole(admin).then(
      () => '',
      (err: Error) => err.message,
    );
    const url = new URL(TEST_ADMIN_DATABASE_URL);
    expect(message).toMatch(/omezenou rolí/);
    expect(message).not.toContain('postgresql://');
    expect(message).not.toContain(url.host); // adresa serveru
    expect(message).not.toContain(url.password === url.username ? '\u0000' : url.password);
  });
});
