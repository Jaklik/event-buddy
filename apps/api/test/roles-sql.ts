// Převede docker/postgres/roles.sql (psql skript s proměnnými) na seznam příkazů pro Prisma.
// Díky tomu se v testech vytváří přesně ta oprávnění, která dostane produkční databáze.
// Podporuje jen to, co skript používá: \getenv, \set a interpolaci :"identifikátor" a :'řetězec'.

const quoteIdentifier = (value: string) => `"${value.replace(/"/g, '""')}"`;
const quoteLiteral = (value: string) => `'${value.replace(/'/g, "''")}'`;

export function renderRolesSql(template: string, env: Record<string, string>): string[] {
  const vars = new Map<string, string>();
  const body: string[] = [];

  for (const raw of template.split('\n')) {
    const line = raw.trim();
    const getenv = /^\\getenv\s+(\w+)\s+(\w+)$/.exec(line);
    const set = /^\\set\s+(\w+)\s+(\S+)$/.exec(line);

    if (getenv) {
      const value = env[getenv[2]];
      if (value === undefined) throw new Error(`Chybí proměnná prostředí ${getenv[2]}`);
      vars.set(getenv[1], value);
    } else if (set) {
      vars.set(set[1], set[2]);
    } else if (line.startsWith('\\')) {
      throw new Error(`Nepodporovaný příkaz psql: ${line}`);
    } else if (line !== '' && !line.startsWith('--')) {
      body.push(raw);
    }
  }

  const lookup = (name: string) => {
    const value = vars.get(name);
    if (value === undefined) throw new Error(`Nedefinovaná proměnná :${name}`);
    return value;
  };

  return body
    .join('\n')
    .replace(/:"(\w+)"/g, (_, name: string) => quoteIdentifier(lookup(name)))
    .replace(/:'(\w+)'/g, (_, name: string) => quoteLiteral(lookup(name)))
    .split(/;[ \t]*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement !== '');
}
