#!/usr/bin/env bash
# Test skriptů pro nasazení (selfplan-deploy, selfplan-deploy-entry) v čistém Debianu s falešným příkazem docker.
# Spuštění z kořene repozitáře: bash infra/server/test-deploy.sh   (vyžaduje Docker; používá oficiální image debian)
set -u

root="$(git rev-parse --show-toplevel)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
cd "$root" || exit 2

# Archivy pro testy: platný a čtyři podezřelé varianty.
git archive --format=tar HEAD > "$work/ok.tar"
mutate() { # název, příkaz upravující rozbalený strom v proměnné $d
  local name="$1"; shift
  local d="$work/tree-$name"; mkdir -p "$d"; tar -xf "$work/ok.tar" -C "$d"
  "$@" "$d"; tar -cf "$work/$name.tar" -C "$d" .
}
add_env() { echo 'POSTGRES_PASSWORD=x' > "$1/.env"; }
add_symlink() { ln -s /etc/passwd "$1/odkaz"; }
drop_compose() { rm "$1/docker-compose.prod.yml"; }
mutate with-env add_env
mutate with-symlink add_symlink
mutate no-compose drop_compose

cat > "$work/inner.sh" <<'INNER'
#!/usr/bin/env bash
set -u
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq >/dev/null && apt-get install -y -qq rsync >/dev/null 2>&1 || { echo "nelze nainstalovat rsync"; exit 2; }

install -m 755 /src/selfplan-deploy /usr/local/sbin/selfplan-deploy
install -m 755 /src/selfplan-deploy-entry /usr/local/bin/selfplan-deploy-entry

# Falešné příkazy: docker zapisuje volání do logu, logger je prázdný (v kontejneru není syslog).
cat > /usr/local/bin/docker <<'EOF'
#!/bin/sh
echo "docker $*" >> /tmp/docker.log
case "$*" in *"compose"*"ps"*) printf 'SERVICE\tSTATUS\napi\tUp (healthy)\n' ;; esac
EOF
printf '#!/bin/sh\nexit 0\n' > /usr/local/bin/logger
chmod 755 /usr/local/bin/docker /usr/local/bin/logger

SHA=0123456789abcdef0123456789abcdef01234567
PW1=$(head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n'); PW2=$(head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n'); PW3=$(head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n')

reset_server() {
  rm -rf /opt/selfplan /tmp/docker.log; mkdir -p /opt/selfplan
  printf 'POSTGRES_PASSWORD=%s\nDB_MIGRATOR_PASSWORD=%s\nDB_APP_PASSWORD=%s\nCORS_ORIGIN=http://localhost:3100\n' "$PW1" "$PW2" "$PW3" > /opt/selfplan/.env
  chmod 600 /opt/selfplan/.env
  echo stary > /opt/selfplan/stary-soubor.txt
  echo "minuly" > /opt/selfplan/.deployed-commit
  chmod 755 /opt/selfplan
}
fails=0
ok() { echo "ok:      $1"; }
no() { echo "SELHALO: $1"; fails=$((fails + 1)); }
deploy() { /usr/local/sbin/selfplan-deploy "$@" 2>&1; }

echo "== platné nasazení"
reset_server
out="$(deploy $SHA < /tmp/in/ok.tar)"; rc=$?
[ $rc -eq 0 ] && ok "skončí úspěšně" || { no "skončí úspěšně (kód $rc)"; echo "$out" | tail -5; }
[ -f /opt/selfplan/docker-compose.prod.yml ] && ok "nahraje soubory z archivu" || no "nahraje soubory z archivu"
[ ! -e /opt/selfplan/stary-soubor.txt ] && ok "smaže soubory, které už v commitu nejsou" || no "smaže staré soubory"
[ "$(grep -c '^POSTGRES_PASSWORD=' /opt/selfplan/.env)" = 1 ] && ok ".env zůstane nedotčený" || no ".env zůstane nedotčený"
[ "$(stat -c %a /opt/selfplan/.env)" = 600 ] && ok ".env má dál práva 600" || no ".env má dál práva 600"
[ "$(cat /opt/selfplan/.deployed-commit)" = "$SHA" ] && ok "zapíše nasazený commit" || no "zapíše nasazený commit"
[ "$(stat -c %a /opt/selfplan)" = 755 ] && ok "práva složky aplikace se nezměnila" || no "práva složky aplikace se nezměnila ($(stat -c %a /opt/selfplan))"
grep -q "compose -f docker-compose.prod.yml up -d --build --wait --remove-orphans" /tmp/docker.log && ok "spustí compose up --wait" || no "spustí compose up --wait"
for pw in "$PW1" "$PW2" "$PW3"; do
  case "$out" in *"$pw"*) no "výstup neobsahuje hesla" ;; *) ;; esac
done
case "$out" in *"$PW1"*|*"$PW2"*|*"$PW3"*) ;; *) ok "výstup neobsahuje hesla" ;; esac

echo; echo "== neplatné argumenty"
for args in "" "nesmysl" "${SHA}x" "$SHA $SHA" "../../etc"; do
  reset_server; deploy $args < /tmp/in/ok.tar >/dev/null; rc=$?
  [ $rc -ne 0 ] && [ ! -e /opt/selfplan/docker-compose.prod.yml ] && ok "odmítne argumenty: '$args'" || no "odmítne argumenty: '$args'"
done

echo; echo "== konfigurace na serveru"
reset_server; chmod 644 /opt/selfplan/.env
out="$(deploy $SHA < /tmp/in/ok.tar)"; rc=$?
[ $rc -ne 0 ] && [ ! -e /opt/selfplan/docker-compose.prod.yml ] && case "$out" in *600*) true ;; *) false ;; esac && ok "odmítne .env s právy 644" || no "odmítne .env s právy 644"
reset_server; rm /opt/selfplan/.env
deploy $SHA < /tmp/in/ok.tar >/dev/null; rc=$?
[ $rc -ne 0 ] && ok "odmítne chybějící .env" || no "odmítne chybějící .env"
reset_server; sed -i 's/^DB_APP_PASSWORD=.*/DB_APP_PASSWORD=kratke/' /opt/selfplan/.env
out="$(deploy $SHA < /tmp/in/ok.tar)"; rc=$?
[ $rc -ne 0 ] && case "$out" in *DB_APP_PASSWORD*) true ;; *) false ;; esac && ok "odmítne příliš krátké heslo a pojmenuje proměnnou" || no "odmítne příliš krátké heslo"
case "$out" in *kratke*) no "chybová hláška neobsahuje hodnotu" ;; *) ok "chybová hláška neobsahuje hodnotu" ;; esac

echo; echo "== podezřelé archivy"
for name in with-env with-symlink no-compose; do
  reset_server; before="$(cat /opt/selfplan/stary-soubor.txt)"
  deploy $SHA < "/tmp/in/$name.tar" >/dev/null; rc=$?
  [ $rc -ne 0 ] && [ -f /opt/selfplan/stary-soubor.txt ] && ok "odmítne archiv $name beze změn na serveru" || no "odmítne archiv $name"
done
reset_server; echo 'nesmysl' | deploy $SHA >/dev/null; rc=$?
[ $rc -ne 0 ] && ok "odmítne poškozený archiv" || no "odmítne poškozený archiv"

echo; echo "== vstupní skript (vynucený příkaz klíče)"
printf '#!/bin/sh\necho "sudo $*" >> /tmp/sudo.log\n' > /usr/local/bin/sudo; chmod 755 /usr/local/bin/sudo
rm -f /tmp/sudo.log
SSH_ORIGINAL_COMMAND="$SHA" /usr/local/bin/selfplan-deploy-entry; rc=$?
[ $rc -eq 0 ] && grep -qx "sudo -n /usr/local/sbin/selfplan-deploy $SHA" /tmp/sudo.log && ok "platný SHA předá skriptu pod sudo" || no "platný SHA předá skriptu pod sudo"
for cmd in "" "bash" "$SHA; id" "$SHA --x" "$(echo $SHA | tr a-f A-F)" "ls -la"; do
  rm -f /tmp/sudo.log
  SSH_ORIGINAL_COMMAND="$cmd" /usr/local/bin/selfplan-deploy-entry >/dev/null 2>&1; rc=$?
  [ $rc -ne 0 ] && [ ! -e /tmp/sudo.log ] && ok "odmítne příkaz: '$cmd'" || no "odmítne příkaz: '$cmd'"
done

echo
[ "$fails" -eq 0 ] && echo "Všechny testy nasazení prošly." || echo "Neúspěšných testů: $fails"
exit $((fails > 0))
INNER

mkdir -p "$work/in"
cp "$work"/*.tar "$work/in/"
docker run --rm \
  -v "$root/infra/server:/src:ro" \
  -v "$work/in:/tmp/in:ro" \
  -v "$work/inner.sh:/inner.sh:ro" \
  debian:13-slim@sha256:f6b08b09a05725f9431502d3b5714f5c4576e82c1a84fa1debe0c24a7e0c3ec4 bash /inner.sh </dev/null
