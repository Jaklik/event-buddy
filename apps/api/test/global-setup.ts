import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { renderRolesSql } from './roles-sql';
import {
  TEST_ADMIN_DATABASE_URL,
  TEST_APP_PASSWORD,
  TEST_APP_ROLE,
  TEST_MIGRATOR_DATABASE_URL,
  TEST_MIGRATOR_PASSWORD,
  TEST_MIGRATOR_ROLE,
} from './test-env';

const client = (url: string) => new PrismaClient({ datasources: { db: { url } } });

// Při každém spuštění vytvoří testovací databázi znovu: role a oprávnění podle docker/postgres/roles.sql,
// schéma migrací pod rolí migrator. Spouští se z adresáře apps/api.
export default async function setup(): Promise<void> {
  const url = new URL(TEST_ADMIN_DATABASE_URL);
  const dbName = url.pathname.slice(1);
  if (!/^[a-z0-9_]+$/.test(dbName)) throw new Error(`Nepovolený název testovací databáze: ${dbName}`);

  const maintenance = new URL(TEST_ADMIN_DATABASE_URL);
  maintenance.pathname = '/postgres';
  const admin = client(maintenance.toString());
  try {
    await admin.$executeRawUnsafe(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
    await admin.$executeRawUnsafe(`DROP ROLE IF EXISTS "${TEST_APP_ROLE}"`);
    await admin.$executeRawUnsafe(`DROP ROLE IF EXISTS "${TEST_MIGRATOR_ROLE}"`);
    await admin.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
  } finally {
    await admin.$disconnect();
  }

  const rolesSql = readFileSync(join(process.cwd(), '../../docker/postgres/roles.sql'), 'utf8');
  const statements = renderRolesSql(rolesSql, {
    POSTGRES_DB: dbName,
    DB_MIGRATOR_PASSWORD: TEST_MIGRATOR_PASSWORD,
    DB_APP_PASSWORD: TEST_APP_PASSWORD,
  });
  const target = client(TEST_ADMIN_DATABASE_URL);
  try {
    for (const statement of statements) await target.$executeRawUnsafe(statement);
  } finally {
    await target.$disconnect();
  }

  execSync('pnpm exec prisma migrate deploy', {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: TEST_MIGRATOR_DATABASE_URL },
    stdio: 'inherit',
  });
}
