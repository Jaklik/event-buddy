#!/usr/bin/env bash
# Jednorázové nastavení nasazování z GitHub Actions na serveru. Spusť jako root z adresáře s tímto skriptem:
#   sudo bash setup-deploy-user.sh "ssh-ed25519 AAAA... github-actions-deploy"
# Argument je VEŘEJNÝ klíč. Soukromý klíč patří jen do tajné proměnné DEPLOY_SSH_KEY v GitHubu.
#
# Co skript udělá:
#   1. nainstaluje rsync,
#   2. vytvoří systémový účet ghdeploy bez hesla a bez práva sudo, kromě jednoho příkazu,
#   3. nainstaluje skripty selfplan-deploy-entry a selfplan-deploy,
#   4. povolí účtu ghdeploy sudo jen pro /usr/local/sbin/selfplan-deploy s argumentem ve tvaru SHA commitu,
#   5. zapíše klíč do authorized_keys s volbami restrict a command=, takže klíč umí jedinou věc: nasadit.
# Skript lze spustit opakovaně (např. při výměně klíče).
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "Spusť přes sudo." >&2; exit 1; }

pubkey="${1:-}"
if ! [[ "$pubkey" =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+(\ [^[:space:]]+)?$ ]]; then
  echo "Očekávám jeden argument: veřejný klíč ve tvaru 'ssh-ed25519 AAAA... komentář'." >&2
  exit 1
fi

here="$(cd "$(dirname "$0")" && pwd)"
for f in selfplan-deploy-entry selfplan-deploy; do
  [ -f "$here/$f" ] || { echo "Vedle skriptu chybí soubor $f." >&2; exit 1; }
done

command -v rsync >/dev/null || apt-get install -y rsync

if ! id ghdeploy >/dev/null 2>&1; then
  adduser --system --group --shell /bin/bash --home /home/ghdeploy ghdeploy
fi

install -m 755 -o root -g root "$here/selfplan-deploy-entry" /usr/local/bin/selfplan-deploy-entry
install -m 755 -o root -g root "$here/selfplan-deploy" /usr/local/sbin/selfplan-deploy

# sudoers: vždy se nejdřív zkontroluje syntaxe, špatný soubor by mohl zablokovat sudo celému serveru.
tmp="$(mktemp)"
printf 'ghdeploy ALL=(root) NOPASSWD: /usr/local/sbin/selfplan-deploy [0-9a-f]*\n' > "$tmp"
visudo -cf "$tmp" >/dev/null || { rm -f "$tmp"; echo "Neplatná syntaxe sudoers, nic jsem nezměnil." >&2; exit 1; }
install -m 440 -o root -g root "$tmp" /etc/sudoers.d/selfplan-ghdeploy
rm -f "$tmp"

# Složka .ssh i authorized_keys patří rootovi: účet ghdeploy si omezení nemůže upravit.
install -d -m 755 -o root -g root /home/ghdeploy/.ssh
printf 'restrict,command="/usr/local/bin/selfplan-deploy-entry" %s\n' "$pubkey" > /home/ghdeploy/.ssh/authorized_keys
chown root:root /home/ghdeploy/.ssh/authorized_keys
chmod 644 /home/ghdeploy/.ssh/authorized_keys

echo "Hotovo."
echo "Ověření: sudo -l -U ghdeploy"
echo "         cat /home/ghdeploy/.ssh/authorized_keys"
