#!/usr/bin/env bash
# One-shot VPS bootstrap for nhdigitalservices.com on Ubuntu 24.04.
#
# Run ONCE as root on a fresh Hostinger VPS:
#   curl -fsSL https://raw.githubusercontent.com/naqishah8/nhdigitalservices.com/main/scripts/bootstrap.sh -o bootstrap.sh
#   sudo bash bootstrap.sh
#
# Idempotent — re-running skips steps that are already done.

set -euo pipefail

# --- config ------------------------------------------------------------------
DOMAIN="nhdigitalservices.com"
APP_USER="deploy"
APP_DIR="/home/${APP_USER}/site"
REPO_URL="https://github.com/naqishah8/nhdigitalservices.com.git"
APP_NAME="nhds"
NODE_MAJOR="20"
LE_EMAIL="wazeer23@gmail.com"
# -----------------------------------------------------------------------------

if [[ "$(id -u)" != "0" ]]; then
  echo "Run as root (use sudo)." >&2
  exit 1
fi

log()  { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*"; }

export DEBIAN_FRONTEND=noninteractive

log "Updating apt and installing prerequisites"
apt-get update -y
apt-get install -y ca-certificates curl gnupg git nginx ufw rsync

log "Ensuring 2G swap exists (Next.js builds can spike memory on 1G VPS)"
if [[ ! -f /swapfile ]] && ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ok "Swap enabled"
else
  ok "Swap already configured"
fi

log "Installing Node.js ${NODE_MAJOR}.x"
if ! command -v node >/dev/null || ! node -v | grep -q "^v${NODE_MAJOR}\."; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
ok "Node $(node -v), npm $(npm -v)"

log "Installing PM2 globally"
command -v pm2 >/dev/null || npm install -g pm2

log "Installing Certbot"
apt-get install -y certbot python3-certbot-nginx

log "Creating '${APP_USER}' user"
if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "${APP_USER}"
  usermod -aG sudo "${APP_USER}"
  if [[ -f /root/.ssh/authorized_keys ]]; then
    mkdir -p "/home/${APP_USER}/.ssh"
    cp /root/.ssh/authorized_keys "/home/${APP_USER}/.ssh/"
    chown -R "${APP_USER}:${APP_USER}" "/home/${APP_USER}/.ssh"
    chmod 700 "/home/${APP_USER}/.ssh"
    chmod 600 "/home/${APP_USER}/.ssh/authorized_keys"
  fi
  # Passwordless sudo for the deploy user (safe: SSH-key only, no password login)
  echo "${APP_USER} ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/90-${APP_USER}"
  chmod 440 "/etc/sudoers.d/90-${APP_USER}"
  ok "User '${APP_USER}' created"
else
  ok "User '${APP_USER}' already exists"
fi

log "Cloning repo into ${APP_DIR}"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  sudo -u "${APP_USER}" git clone "${REPO_URL}" "${APP_DIR}"
else
  sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && git fetch --prune origin && git reset --hard origin/main"
fi

log "Writing ${APP_DIR}/.env (Gemini key blank — fill in later)"
if [[ ! -f "${APP_DIR}/.env" ]]; then
  cat > "${APP_DIR}/.env" <<EOF
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=
EOF
  chown "${APP_USER}:${APP_USER}" "${APP_DIR}/.env"
  chmod 600 "${APP_DIR}/.env"
else
  ok ".env already present — leaving as-is"
fi

log "Installing npm deps (this takes a minute)"
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && npm ci --no-audit --no-fund"

log "Building Next.js (this takes 1-3 minutes)"
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && npm run build"

log "Starting PM2 process '${APP_NAME}'"
if sudo -u "${APP_USER}" bash -lc "pm2 describe ${APP_NAME} >/dev/null 2>&1"; then
  sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && pm2 reload ${APP_NAME} --update-env"
else
  sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && pm2 start 'npm run start' --name ${APP_NAME} --time"
fi
sudo -u "${APP_USER}" bash -lc "pm2 save"

log "Installing systemd unit so PM2 resurrects on reboot"
cat > "/etc/systemd/system/pm2-${APP_USER}.service" <<EOF
[Unit]
Description=PM2 process manager for ${APP_USER}
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=forking
User=${APP_USER}
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
Environment=PM2_HOME=/home/${APP_USER}/.pm2
PIDFile=/home/${APP_USER}/.pm2/pm2.pid
Restart=on-failure

ExecStart=/usr/bin/pm2 resurrect
ExecReload=/usr/bin/pm2 reload all
ExecStop=/usr/bin/pm2 kill

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "pm2-${APP_USER}" >/dev/null

# Kill the user-space PM2 daemon so systemd can fork a fresh one it owns.
# The process list is already saved in dump.pm2 and `pm2 resurrect` will
# respawn the nhds app when systemd starts the service.
sudo -u "${APP_USER}" pm2 kill >/dev/null 2>&1 || true
sleep 1

if ! systemctl restart "pm2-${APP_USER}"; then
  warn "systemd pm2 unit failed to start — bringing PM2 back up directly as ${APP_USER}"
  sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && pm2 resurrect || pm2 start 'npm run start' --name ${APP_NAME} --time"
  sudo -u "${APP_USER}" pm2 save >/dev/null 2>&1 || true
fi

log "Smoke-testing local app on 127.0.0.1:3000"
sleep 2
if ! curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000 | grep -qE "^(200|301|302|307|308)$"; then
  warn "App did not return a 2xx/3xx. Inspect logs with:  sudo -u ${APP_USER} pm2 logs ${APP_NAME}"
fi

log "Writing Nginx config for ${DOMAIN}"
cat > "/etc/nginx/sites-available/${DOMAIN}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
    }

    client_max_body_size 10m;
}
NGINX

ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

log "Enabling UFW firewall (SSH + Nginx only)"
ufw allow OpenSSH >/dev/null
ufw allow 'Nginx Full' >/dev/null
ufw --force enable >/dev/null
ok "Firewall active"

log "Requesting Let's Encrypt certificate"
# Try apex + www first. If www has no DNS, retry with just apex.
if certbot --nginx --non-interactive --agree-tos -m "${LE_EMAIL}" \
     --redirect -d "${DOMAIN}" -d "www.${DOMAIN}" 2>/tmp/certbot.log; then
  ok "Certificate issued for ${DOMAIN} + www.${DOMAIN}"
else
  warn "www subdomain failed (likely no DNS record yet) — retrying apex only"
  certbot --nginx --non-interactive --agree-tos -m "${LE_EMAIL}" \
     --redirect -d "${DOMAIN}"
  ok "Certificate issued for ${DOMAIN} only. Add a www A/CNAME record in Hostinger and run:"
  echo "    sudo certbot --nginx --expand -d ${DOMAIN} -d www.${DOMAIN}"
fi

echo ""
ok "Bootstrap complete."
echo ""
echo "  Site:        https://${DOMAIN}"
echo "  App dir:     ${APP_DIR}"
echo "  PM2 logs:    sudo -u ${APP_USER} pm2 logs ${APP_NAME}"
echo "  PM2 status:  sudo -u ${APP_USER} pm2 status"
echo ""
echo "  Add the Gemini key later:"
echo "    sudo -u ${APP_USER} nano ${APP_DIR}/.env     # fill GEMINI_API_KEY=..."
echo "    sudo -u ${APP_USER} pm2 reload ${APP_NAME} --update-env"
echo ""
echo "  Deploy new commits (after pushing to GitHub):"
echo "    ssh ${APP_USER}@<vps-ip>"
echo "    cd ~/site && ./scripts/deploy.sh"
