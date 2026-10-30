import type { PrismaClient } from '@prisma/client';

const PRIVILEGES = ['rolsuper', 'rolcreaterole', 'rolcreatedb', 'rolreplication', 'rolbypassrls'] as const;

// API se musí připojovat pod omezenou rolí. Kdyby se kvůli chybné konfiguraci připojilo jako superuživatel,
// případná SQL injekce by mohla měnit schéma i spouštět příkazy na serveru, proto ho radši nenastartujeme.
export async function assertRestrictedRole(client: Pick<PrismaClient, '$queryRaw'>): Promise<void> {
  const [role] = await client.$queryRaw<(Record<(typeof PRIVILEGES)[number], boolean> & { name: string })[]>`
    SELECT current_user AS name, rolsuper, rolcreaterole, rolcreatedb, rolreplication, rolbypassrls
    FROM pg_roles WHERE rolname = current_user`;
  const excessive = PRIVILEGES.filter((privilege) => role?.[privilege]);
  if (!role || excessive.length > 0) {
    throw new Error(
      `Databázová role ${role?.name ?? '(neznámá)'} má nadměrná oprávnění (${excessive.join(', ')}). ` +
        'API se musí připojovat pod omezenou rolí (viz docker/postgres/roles.sql).',
    );
  }
}
