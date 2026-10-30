#!/usr/bin/env bash
# Kontrola, že se do repozitáře nedostaly secrets. Bez externích nástrojů.
#   scripts/check-secrets.sh            zkontroluje všechny sledované soubory
#   scripts/check-secrets.sh --staged   zkontroluje jen soubory připravené k commitu (používá pre-commit hook)
# Nálezy se vypisují jako soubor:řádek a název pravidla. Nalezená hodnota se nikdy nevypisuje.
# Nahrazuje plnohodnotný skener (např. gitleaks) jen částečně: hledá známé tvary klíčů a hesla v adresách.
set -u

mode="${1:-all}"
root="$(git rev-parse --show-toplevel)"
cd "$root" || exit 2

if [ "$mode" = "--staged" ]; then
  files="$(git diff --cached --name-only --diff-filter=ACM)"
else
  files="$(git ls-files)"
fi

problems=0
report() { printf '  %s  [%s]\n' "$1" "$2"; problems=$((problems + 1)); }

# 1) Soubory, které v gitu nemají být. Vzory .example jsou povolené.
while IFS= read -r f; do
  [ -z "$f" ] && continue
  base="$(basename "$f")"
  case "$base" in
    *.example) continue ;;
    .env|.env.*) report "$f" "soubor s prostředím (.env)" ;;
    *.pem|*.key|*.p12|*.pfx|*.kdbx|*.jks|*.keystore|id_rsa|id_rsa.*|id_ed25519|id_ed25519.*|id_ecdsa|id_ecdsa.*)
      report "$f" "soukromý klíč nebo úložiště klíčů" ;;
  esac
  case "$f" in
    secrets/*|*/secrets/*) report "$f" "adresář secrets" ;;
  esac
done <<EOF
$files
EOF

# 2) Obsah souborů. Přeskakuje se binární obsah, lock soubory a tento skript.
patterns=(
  '-----BEGIN ([A-Z]+ )?PRIVATE KEY-----|soukromý klíč v textu'
  'AKIA[0-9A-Z]{16}|přístupový klíč AWS'
  'gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|token GitHub'
  'xox[baprs]-[A-Za-z0-9-]{10,}|token Slack'
  '(sk|rk)_live_[A-Za-z0-9]{16,}|klíč Stripe'
  'AGE-SECRET-KEY-[A-Z0-9]{20,}|soukromý klíč age'
)

while IFS= read -r f; do
  [ -z "$f" ] && continue
  [ -f "$f" ] || continue
  case "$f" in
    scripts/check-secrets*|pnpm-lock.yaml|*.lock|*/pnpm-lock.yaml) continue ;;
  esac
  for entry in "${patterns[@]}"; do
    regex="${entry%%|*}"
    name="${entry##*|}"
    # grep vrací jen čísla řádků, ne obsah.
    for line in $(grep -InE -e "$regex" "$f" 2>/dev/null | cut -d: -f1); do
      report "$f:$line" "$name"
    done
  done
  # Adresa databáze s heslem. Povolené jsou zástupné hodnoty (${...}, <...>, příklady) a vývojové heslo selfplan.
  for line in $(grep -InE -e 'postgres(ql)?://[^:/[:space:]]+:[^@[:space:]]{6,}@' "$f" 2>/dev/null \
      | grep -vE '\$\{|<|selfplan:selfplan@|localtest|test-|example' | cut -d: -f1); do
    report "$f:$line" "adresa databáze s heslem"
  done
done <<EOF
$files
EOF

# 3) Konzistence ochran proti úniku.
grep -qxE '\.env' .gitignore 2>/dev/null || report ".gitignore" "chybí řádek .env"
grep -qE '^\.env\.\*' .gitignore 2>/dev/null || report ".gitignore" "chybí řádek .env.*"
grep -qxE '\*\*?/?\.env|\.env' .dockerignore 2>/dev/null || report ".dockerignore" "chybí řádek .env (soubor by skončil v Docker image)"
grep -qE '^\.env\.\*' .dockerignore 2>/dev/null || report ".dockerignore" "chybí řádek .env.*"

# Proměnné NUXT_PUBLIC_* se posílají do prohlížeče; nikdy nesmí nést secret.
for f in docker-compose*.yml; do
  [ -f "$f" ] || continue
  for line in $(grep -nE 'NUXT_PUBLIC_[A-Z0-9_]*(SECRET|PASSWORD|PASSWD|TOKEN|PRIVATE|KEY)' "$f" | cut -d: -f1); do
    report "$f:$line" "secret v proměnné NUXT_PUBLIC_* (jde do prohlížeče)"
  done
done

if [ "$problems" -gt 0 ]; then
  echo "Kontrola secrets: nalezeno problémů: $problems. Hodnoty se z bezpečnostních důvodů nevypisují." >&2
  echo "Pokud je nález falešný, uprav kód tak, aby používal zástupnou hodnotu (např. \${PROMENNA})." >&2
  exit 1
fi
echo "Kontrola secrets: v pořádku."
