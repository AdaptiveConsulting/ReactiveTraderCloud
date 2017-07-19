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

# ensure updateServers.sh is executable
chmod 755 /opt/updateServers.sh

# add 404 error page
mkdir /www
cat <<EOF > /www/404.html
Error 404
Service does not exist
EOF
