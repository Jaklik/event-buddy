#!/usr/bin/env bash
# Test kontroly secrets: v dočasném repozitáři podstrčí zakázané soubory a falešné klíče a ověří,
# že je skript zachytí, že bezpečný obsah propustí a že nálezy nevypisují samotné hodnoty.
set -u

script="$(cd "$(dirname "$0")" && pwd)/check-secrets.sh"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cd "$tmp" || exit 2
git init -q . && git config user.email t@example.cz && git config user.name t

fails=0
expect() { # popis, očekávaný návratový kód, argumenty skriptu...
  local name="$1" want="$2"; shift 2
  out="$("$script" "$@" 2>&1)"; got=$?
  if [ "$got" -ne "$want" ]; then echo "SELHALO: $name (kód $got, čekáno $want)"; echo "$out" | sed 's/^/    /'; fails=$((fails + 1)); else echo "ok: $name"; fi
}

reset() { rm -rf ./* .env* .gitignore .dockerignore; git rm -rq --cached . 2>/dev/null; true; }
good_ignores() { printf '.env\n.env.*\n!.env.example\n' > .gitignore; cp .gitignore .dockerignore; }

# Základ: ochrany na místě, žádné secrets.
good_ignores; echo 'hello' > a.txt; git add -A
expect "čistý repozitář projde" 0

# Zakázané soubory.
good_ignores; echo 'X=1' > .env; git add -f .env
expect ".env v gitu je zachyceno" 1
reset; good_ignores; echo 'X=1' > .env.production; git add -f .env.production
expect ".env.production v gitu je zachyceno" 1
reset; good_ignores; echo 'X=' > .env.example; git add -f .env.example
expect ".env.example je povolený" 0
reset; good_ignores; echo 'x' > server.pem; git add server.pem
expect "soubor .pem je zachycen" 1

# Obsah.
reset; good_ignores; printf -- '-----BEGIN PRIVATE KEY-----\nabc\n' > k.txt; git add -A
expect "soukromý klíč v textu je zachycen" 1
reset; good_ignores; echo 'key=AKIAABCDEFGHIJKLMNOP' > c.txt; git add -A
expect "klíč AWS je zachycen" 1
reset; good_ignores; echo 'DATABASE_URL=postgresql://app:Zr7vK2pQx9Lm@db:5432/x' > d.txt; git add -A
expect "heslo v adrese databáze je zachyceno" 1
reset; good_ignores; echo 'DATABASE_URL=postgresql://app:${DB_PASSWORD}@db:5432/x' > d.txt; git add -A
expect "zástupná hodnota v adrese databáze projde" 0
reset; good_ignores; echo 'DATABASE_URL=postgresql://selfplan:selfplan@localhost/x' > d.txt; git add -A
expect "vývojové heslo selfplan projde" 0

# Ochrany proti úniku.
reset; printf '.env\n' > .gitignore; echo ok > a.txt; cp .gitignore .dockerignore; git add -A
expect "chybějící .env.* v .gitignore je zachyceno" 1
reset; printf '.env\n.env.*\n' > .gitignore; echo ok > a.txt; git add -A
expect "chybějící .dockerignore je zachyceno" 1
reset; good_ignores; printf 'services:\n  web:\n    environment:\n      NUXT_PUBLIC_API_SECRET: x\n' > docker-compose.yml; git add -A
expect "secret v NUXT_PUBLIC_* je zachycen" 1

# Režim --staged kontroluje jen připravené soubory.
reset; good_ignores; echo ok > a.txt; git add -A; git commit -qm base
echo 'X=1' > .env.local
expect "nepřipravený .env.local --staged neblokuje" 0 --staged
git add -f .env.local
expect "připravený .env.local --staged blokuje" 1 --staged

# Nález nevypisuje hodnotu.
reset; git reset -q; good_ignores; echo 'token=ghp_abcdefghijklmnopqrstuvwxyz0123456789' > t.txt; git add -A
out="$("$script" 2>&1)"
if echo "$out" | grep -q 'abcdefghijklmnopqrstuvwxyz0123456789'; then echo "SELHALO: výpis obsahuje hodnotu tajného klíče"; fails=$((fails + 1)); else echo "ok: nález nevypisuje hodnotu"; fi

[ "$fails" -eq 0 ] && echo "Všechny testy kontroly secrets prošly." || { echo "Neúspěšných testů: $fails"; exit 1; }
