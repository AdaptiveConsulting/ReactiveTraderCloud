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
    listen 80;
    server_name $service-$namespace.__DOMAINNAME__;

    location / {
        proxy_pass http://$service.$namespace;
    }
}
EOF
}

createWsFile() {
portNumber=$1
service=$2
namespace=$3
file="/servers/ws.$service.$namespace"

cat <<EOF > $file
server {
    listen      $portNumber;
    server_name $service-$namespace.__DOMAINNAME__;

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
}

# SSL
createHttpsFile() {
portNumber=$1
service=$2
namespace=$3
file="/servers/https.$service.$namespace"

cat <<EOF > $file 
server {
    listen      443;
    server_name $service-$namespace.__DOMAINNAME__;
    
    ssl                    on;
    ssl_certificate        /etc/ssl/__DOMAINNAME__.pem;
    ssl_certificate_key    /etc/ssl/__DOMAINNAME__.key;

    location / {
        proxy_pass http://$service.$namespace:$portNumber;
    }
}
EOF
}

createWssFile() {
portNumber=$1
service=$2
namespace=$3
file="/servers/ws.$service.$namespace"

cat <<EOF > $file
server {
    listen      $portNumber;
    server_name $service-$namespace.__DOMAINNAME__;

    ssl                    on;
    ssl_certificate        /etc/ssl/__DOMAINNAME__.pem;
    ssl_certificate_key    /etc/ssl/__DOMAINNAME__.key;

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
}
