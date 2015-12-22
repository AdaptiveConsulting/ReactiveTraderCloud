#! /bin/bash

# fail fast
set -euo pipefail

# start nginx
nginx &
echo "[nginx] started"

# start update continuously
while true; do
  /opt/updateServers.sh
  nginx -s reload
  sleep 10
done
