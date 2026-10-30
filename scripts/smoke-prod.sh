#!/usr/bin/env bash
# Smoke test produkčního compose na jednorázovém stacku: projekt selfplan-smoke, náhodná hesla, náhodné porty.
# Spouští se v CI (.github/workflows/ci.yml) a jde ho pustit i lokálně: bash scripts/smoke-prod.sh
# Nikdy se nedotýká projektu selfplan-prod ani jeho dat. Hesla jsou v dočasném souboru a nevypisují se.
set -u

cd "$(git rev-parse --show-toplevel)" || exit 2
umask 077
tmp="$(mktemp -d)"
project=selfplan-smoke
envf="$tmp/smoke.env"

{
  echo "POSTGRES_PASSWORD=$(openssl rand -hex 24)"
  echo "DB_MIGRATOR_PASSWORD=$(openssl rand -hex 24)"
  echo "DB_APP_PASSWORD=$(openssl rand -hex 24)"
  echo "CORS_ORIGIN=http://localhost:3100"
  echo "SESSION_COOKIE_SECURE=false"
} > "$envf"

# Náhodné porty na hostiteli, aby test nekolidoval s ničím, co už běží.
cat > "$tmp/ports.yml" <<'YAML'
services:
  api:
    ports: !override
      - "127.0.0.1::4000"
  web:
    ports: !override
      - "127.0.0.1::3000"
YAML

dc() { docker compose -p "$project" --env-file "$envf" -f docker-compose.prod.yml -f "$tmp/ports.yml" "$@" </dev/null; }
cleanup() { dc down -v --remove-orphans >/dev/null 2>&1; rm -rf "$tmp"; }
trap cleanup EXIT

set -a; . "$envf"; set +a

fails=0
ok() { printf 'ok:      %s\n' "$1"; }
fail() { printf 'SELHALO: %s\n' "$1"; fails=$((fails + 1)); }
expect() { if [ "$2" = "$3" ]; then ok "$1"; else fail "$1 (bylo '$2', čekáno '$3')"; fi; }
strip() { sed -E 's/\x1b\[[0-9;]*m//g'; }
sql() { dc exec -T postgres psql -U selfplan -d selfplan -tAc "$1"; }

echo "=== sestavení a start (postgres, migrate, api, web)"
if ! dc up -d --build --wait api web 2>&1 | tail -n 15; then
  :
fi
echo "stav: $(dc ps -a --format '{{.Service}}={{.Status}}' | tr '\n' ' ')"
# Stav se kontroluje po jednotlivých službách; společný řetězec by nechal projít shodu u jiné služby.
service_status() { dc ps -a --format '{{.Service}}={{.Status}}' | grep "^$1=" || true; }
case "$(service_status api)" in *"(healthy)"*) ok "api je healthy" ;; *) fail "api není healthy"; dc logs --tail 40 api 2>&1 | strip | cut -c1-200 ;; esac
case "$(service_status web)" in *"(healthy)"*) ok "web je healthy" ;; *) fail "web není healthy" ;; esac
case "$(service_status postgres)" in *"(healthy)"*) ok "postgres je healthy" ;; *) fail "postgres není healthy" ;; esac
case "$(service_status migrate)" in *"Exited (0)"*) ok "migrace doběhla" ;; *) fail "migrace nedoběhla úspěšně" ;; esac

api="http://127.0.0.1:$(dc port api 4000 | sed 's/.*://')/api"
web="http://127.0.0.1:$(dc port web 3000 | sed 's/.*://')"

echo; echo "=== databázové role"
expect "role app není superuživatel" "$(sql "select rolsuper from pg_roles where rolname='selfplan_app'")" "f"
expect "databázi vlastní migrator" "$(sql "select pg_get_userbyid(datdba) from pg_database where datname='selfplan'")" "selfplan_migrator"
expect "tabulky vlastní migrator" "$(sql "select tableowner from pg_tables where tablename='User'")" "selfplan_migrator"
expect "API je připojené jako app" "$(sql "select distinct usename from pg_stat_activity where datname='selfplan' and usename like 'selfplan_%'" | tr '\n' ' ')" "selfplan_app "
expect "práva app na User" "$(sql "select string_agg(privilege_type, ',' order by privilege_type) from information_schema.role_table_grants where grantee='selfplan_app' and table_name='User'")" "DELETE,INSERT,SELECT,UPDATE"

echo; echo "=== scénář přihlášení"
jar="$tmp/jar"
code() { curl -s -m 15 -o /dev/null -w '%{http_code}' "$@"; }
json=(-H 'Content-Type: application/json')
csrf=(-H 'x-sp-csrf: 1')
creds='{"email":"smoke@example.cz","password":"correct horse battery staple"}'
expect "health API" "$(curl -s -m 15 "$api/health")" '{"status":"ok"}'
expect "health web" "$(curl -s -m 15 "$web/api/health")" '{"status":"ok"}'
expect "registrace" "$(code "${csrf[@]}" "${json[@]}" -X POST "$api/auth/register" -d "$creds")" "202"
expect "přihlášení" "$(code -c "$jar" "${csrf[@]}" "${json[@]}" -X POST "$api/auth/login" -d "$creds")" "200"
old="$(awk '/sp_session/{print $7}' "$jar")"
expect "me" "$(code -b "$jar" "$api/auth/me")" "200"
expect "refresh" "$(code -b "$jar" -c "$jar" "${csrf[@]}" -X POST "$api/auth/refresh")" "204"
new="$(awk '/sp_session/{print $7}' "$jar")"
[ -n "$old" ] && [ "$old" != "$new" ] && ok "token se při refreshi změnil" || fail "token se při refreshi nezměnil"
expect "me po refreshi" "$(code -b "$jar" "$api/auth/me")" "200"
expect "logout bez CSRF hlavičky" "$(code -b "$jar" -X POST "$api/auth/logout")" "403"
expect "logout" "$(code -b "$jar" -c "$jar" "${csrf[@]}" -X POST "$api/auth/logout")" "204"
expect "me po logoutu" "$(code -b "$jar" "$api/auth/me")" "401"
expect "špatné heslo" "$(code "${csrf[@]}" "${json[@]}" -X POST "$api/auth/login" -d '{"email":"smoke@example.cz","password":"wrong-password-123"}')" "401"

echo; echo "=== hlavičky"
hdr_api="$(curl -s -m 15 -I "$api/health" | tr -d '\r' | tr 'A-Z' 'a-z')"
hdr_web="$(curl -s -m 15 -I -X GET "$web/" | tr -d '\r' | tr 'A-Z' 'a-z')"
case "$hdr_api" in *strict-transport-security*) ok "API posílá HSTS" ;; *) fail "API neposílá HSTS" ;; esac
case "$hdr_api" in *x-powered-by*) fail "API prozrazuje x-powered-by" ;; *) ok "API neprozrazuje technologii" ;; esac
case "$hdr_web" in *x-content-type-options:\ nosniff*) ok "web posílá nosniff" ;; *) fail "web neposílá nosniff" ;; esac
case "$hdr_web" in *x-powered-by*) fail "web prozrazuje x-powered-by" ;; *) ok "web neprozrazuje technologii" ;; esac

echo; echo "=== pojistky konfigurace (start musí selhat)"
out="$(dc run --rm -T --no-deps -e DATABASE_URL="postgresql://selfplan:${POSTGRES_PASSWORD}@postgres:5432/selfplan" --entrypoint node api dist/main.js 2>&1 | strip)"
case "$out" in *nadměrná*) ok "API odmítne start pod superuživatelem" ;; *) fail "API pod superuživatelem nastartovalo nebo selhalo z jiného důvodu" ;; esac
weak_password=selfplan # záměrně slabé výchozí heslo, které musí produkční konfigurace odmítnout
out="$(dc run --rm -T --no-deps -e DATABASE_URL="postgresql://selfplan_app:${weak_password}@postgres:5432/selfplan" --entrypoint node api dist/main.js 2>&1 | strip)"
case "$out" in *"alespoň 24 znaků"*) ok "API odmítne slabé heslo v produkci" ;; *) fail "slabé heslo v produkci nebylo odmítnuto" ;; esac

echo; echo "=== izolace a úniky secrets"
if docker ps --filter "label=com.docker.compose.project=$project" --format '{{.Names}} {{.Ports}}' | grep postgres | grep -q -- '->'; then
  fail "PostgreSQL má publikovaný port"
else
  ok "PostgreSQL nemá publikovaný port"
fi
logs="$(dc logs 2>&1)"
for v in POSTGRES_PASSWORD DB_MIGRATOR_PASSWORD DB_APP_PASSWORD; do
  eval "val=\$$v"
  expect "$v není v logech" "$(printf '%s' "$logs" | grep -cF -- "$val")" "0"
done
for svc in api web; do
  img="$project-$svc" # compose pojmenuje sestavený image <projekt>-<služba>
  expect "image $svc neobsahuje soubory .env" "$(docker run --rm --entrypoint sh "$img" -c 'find / -name ".env*" -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null | wc -l' </dev/null | tr -d ' ')" "0"
  hist="$(docker history --no-trunc "$img" 2>&1 </dev/null)"
  leak=0
  for v in POSTGRES_PASSWORD DB_MIGRATOR_PASSWORD DB_APP_PASSWORD; do eval "val=\$$v"; leak=$((leak + $(printf '%s' "$hist" | grep -cF -- "$val"))); done
  expect "historie image $svc neobsahuje hesla" "$leak" "0"
done

echo
if [ "$fails" -eq 0 ]; then echo "Smoke test prošel."; else echo "Smoke test selhal: $fails kontrol."; fi
exit $((fails > 0))
