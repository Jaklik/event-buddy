#!/usr/bin/env node
// Brána pro audit závislostí: použití `pnpm audit --prod --json > audit.json; node scripts/audit-gate.mjs audit.json`.
// Selže při vysokém nebo kritickém nálezu v produkčních závislostech API (výchozí prefix apps/api).
// Nálezy v build nástrojích webu se jen vypíšou: do produkčního image web se nedostanou (kopíruje se jen .output).
// Nečitelný nebo chybový výstup auditu (např. nedostupný registr) brání úspěchu, ať se nálezy nepřehlédnou.
import { readFileSync } from 'node:fs';

const [file, ...prefixes] = process.argv.slice(2);
const blockingPrefixes = prefixes.length > 0 ? prefixes : ['apps/api'];

if (!file) {
  console.error('Použití: node scripts/audit-gate.mjs <audit.json> [prefix ...]');
  process.exit(2);
}

let report;
try {
  report = JSON.parse(readFileSync(file, 'utf8'));
} catch {
  console.error('Audit: výstup nelze načíst, kontrola proto selhává.');
  process.exit(1);
}
if (report.error || typeof report.advisories !== 'object' || report.advisories === null) {
  console.error('Audit: výstup neobsahuje seznam nálezů (chyba registru?), kontrola proto selhává.');
  process.exit(1);
}

const severe = Object.values(report.advisories).filter((a) => ['high', 'critical'].includes(a.severity));
let blocking = 0;

for (const advisory of severe) {
  const paths = (advisory.findings ?? []).flatMap((f) => f.paths ?? []);
  const isBlocking = paths.some((p) => blockingPrefixes.some((prefix) => p.startsWith(prefix)));
  if (isBlocking) blocking += 1;
  const ghsa = String(advisory.url ?? '').split('/').pop();
  console.log(
    `${isBlocking ? 'BLOKUJE ' : 'jen výpis'}  ${advisory.severity.padEnd(8)} ${advisory.module_name}  ${ghsa}  ${advisory.title}`,
  );
}

const totals = report.metadata?.vulnerabilities ?? {};
console.log(`\nCelkem: ${JSON.stringify(totals)}; vysoké a kritické: ${severe.length}; blokující: ${blocking}`);
process.exit(blocking > 0 ? 1 : 0);
