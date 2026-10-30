import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderRolesSql } from './roles-sql';

const env = { POSTGRES_DB: 'selfplan', DB_MIGRATOR_PASSWORD: 'mig-pw', DB_APP_PASSWORD: 'app-pw' };

describe('renderRolesSql', () => {
  it('nahradí proměnné a vrátí jednotlivé příkazy bez komentářů', () => {
    const statements = renderRolesSql(
      [
        '-- komentář',
        '\\getenv db POSTGRES_DB',
        '\\getenv pw DB_APP_PASSWORD',
        '\\set role selfplan_app',
        'CREATE ROLE :"role" LOGIN PASSWORD :\'pw\';',
        'GRANT CONNECT ON DATABASE :"db" TO :"role";',
      ].join('\n'),
      env,
    );
    expect(statements).toEqual([
      `CREATE ROLE "selfplan_app" LOGIN PASSWORD 'app-pw'`,
      `GRANT CONNECT ON DATABASE "selfplan" TO "selfplan_app"`,
    ]);
  });

  it('řetězce a identifikátory se uvozují bezpečně (uvozovky v hodnotě se zdvojí)', () => {
    const statements = renderRolesSql(
      '\\getenv pw DB_APP_PASSWORD\n\\getenv db POSTGRES_DB\nSELECT :\'pw\', :"db";',
      { ...env, DB_APP_PASSWORD: `x'; DROP ROLE y; --`, POSTGRES_DB: 'a"b' },
    );
    expect(statements).toEqual([`SELECT 'x''; DROP ROLE y; --', "a""b"`]);
  });

  it('chybějící proměnná prostředí nebo nepodporovaný příkaz je chyba', () => {
    expect(() => renderRolesSql('\\getenv x NENI_NASTAVENO\nSELECT 1;', env)).toThrow(/NENI_NASTAVENO/);
    expect(() => renderRolesSql('\\connect db\nSELECT 1;', env)).toThrow(/Nepodporovaný/);
    expect(() => renderRolesSql('SELECT :"nezname";', env)).toThrow(/nezname/);
  });

  it('skutečný skript roles.sql se zpracuje a obsahuje hesla jen jako uvozené řetězce', () => {
    const sql = readFileSync(join(process.cwd(), '../../docker/postgres/roles.sql'), 'utf8');
    const statements = renderRolesSql(sql, env);
    expect(statements.length).toBeGreaterThan(8);
    expect(statements[0]).toBe(`CREATE ROLE "selfplan_migrator" LOGIN PASSWORD 'mig-pw'`);
    expect(statements.join('\n')).not.toMatch(/:['"]/); // žádná neexpandovaná proměnná
  });
});
