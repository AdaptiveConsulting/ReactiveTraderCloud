#! /bin/bash

# fail fast
set -euo pipefail

createHttpFile() {
portNumber=$1
service=$2
namespace=$3
file="/servers/http.$service.$namespace"
mkdir -p /servers
cat <<EOF > $file 
server {
    listen $portNumber;
    server_name $service-$namespace.__DOMAIN__;

    location / {
        proxy_set_header        Host $host;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        
        proxy_pass http://$service.$namespace:$portNumber;
  }
}
EOF
echo "$file generated:"
cat $file 
}

createWsFile() {
portNumber=$1
service=$2
namespace=$3
file="/servers/ws.$service.$namespace"

cat <<EOF > $file
server {
    listen $portNumber;
    server_name $service-$namespace.__DOMAIN__;

    location / {
        proxy_pass http://$service.$namespace:$portNumber;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        
        # ws support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
echo "$file generated:"
cat $file
}
