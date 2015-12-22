#! /bin/bash

# fail fast
set -euo pipefail

# nginx redirection for container
ln -sf /dev/stdout /var/log/nginx/access.log
ln -sf /dev/stderr /var/log/nginx/error.log

# get curl
apt-get update
apt-get install -y curl

# get jq
apt-get install -y jq

# create servers folder
mkdir -p servers

# prepare updateServers.sh
chmod 755 /opt/updateServers.sh
