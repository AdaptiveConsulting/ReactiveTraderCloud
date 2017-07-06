#! /bin/bash

# DOC:
# - cors: https://gist.github.com/alexjs/4165271

# fail fast
set -euo pipefail

NSGATE_VERSION="__NSGATE_VERSION__"
DOMAIN_NAME="__DOMAIN_NAME__"

createHttpFile() {
portNumber=$1
service=$2
namespace=$3
file="/servers/http.$service.$namespace"
mkdir -p /servers
cat <<EOF > $file
server {
    listen 80;
    server_name     $service-$namespace.${DOMAIN_NAME};

    error_log       /dev/stderr info;
    access_log      /dev/stdout;

    location / {
        # Miscalneous
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Config   'http';
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Version  "${NSGATE_VERSION}";

        # Proxy
        proxy_set_header    Host                \$host;
        proxy_set_header    X-Real-IP           \$remote_addr;
        proxy_set_header    X-Forwarded-Proto   \$scheme;
        proxy_set_header    X-Forwarded-For     \$proxy_add_x_forwarded_for;
        proxy_pass          http://$service.$namespace;

        # Security
        # proxy_set_header    Access-Control-Allow-Origin     '*';
        # proxy_set_header    Access-Control-Allow-Methods    'GET, POST, OPTIONS';
        # proxy_set_header    Access-Control-Allow-Headers    'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
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
    listen          $portNumber;
    server_name     $service-$namespace.${DOMAIN_NAME};

    error_log       /dev/stderr info;
    access_log      /dev/stdout;

    location / {
        # Miscalneous
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Config   'ws';
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Version  "${NSGATE_VERSION}";

        # Proxy
        proxy_set_header    Host                \$host;
        proxy_set_header    X-Real-IP           \$remote_addr;
        proxy_set_header    X-Forwarded-For     \$proxy_add_x_forwarded_for;
        proxy_pass          http://$service.$namespace:$portNumber;

        # ws
        # proxy_http_version  1.1;
        # proxy_set_header    Upgrade     \$http_upgrade;
        # proxy_set_header    Connection  "upgrade";
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
    # serve
    listen          443;
    server_name     $service-$namespace.${DOMAIN_NAME};

    # log
    error_log       /dev/stderr info;
    access_log      /dev/stdout;

    # Security
    ssl                     on;
    ssl_certificate         /etc/ssl/${DOMAIN_NAME}.pem;
    ssl_certificate_key     /etc/ssl/${DOMAIN_NAME}.key;

    location / {
        # Miscalneous
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Config   'https';
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Version  "${NSGATE_VERSION}";

        # Proxy
        proxy_set_header    Host                \$host;
        proxy_set_header    X-Real-IP           \$remote_addr;
        proxy_set_header    X-Forwarded-Proto   \$scheme;
        proxy_set_header    X-Forwarded-For     \$proxy_add_x_forwarded_for;
        proxy_pass          http://$service.$namespace:$portNumber;

        # Security
        # proxy_set_header    Access-Control-Allow-Origin     '*';
        # proxy_set_header    Access-Control-Allow-Methods    'GET, POST, OPTIONS';
        # proxy_set_header    Access-Control-Allow-Headers    'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
    }
}
EOF
}

createWssFile() {
portNumber=$1
service=$2
namespace=$3
file="/servers/wss.$service.$namespace"

cat <<EOF > $file
server {
    # serve
    listen          $portNumber;
    server_name     $service-$namespace.${DOMAIN_NAME};

    # log
    error_log       /dev/stderr info;
    access_log      /dev/stdout;

    # security
    ssl                     on;
    ssl_certificate         /etc/ssl/${DOMAIN_NAME}.pem;
    ssl_certificate_key     /etc/ssl/${DOMAIN_NAME}.key;

    location / {
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Config   'wss';
        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Version  "${NSGATE_VERSION}";

        # Proxy
        proxy_set_header    Host                \$host;
        proxy_set_header    X-Real-IP           \$remote_addr;
        proxy_set_header    X-Forwarded-For     \$proxy_add_x_forwarded_for;
        proxy_pass          http://$service.$namespace:$portNumber;

        # Security
        # proxy_set_header    Access-Control-Allow-Origin     '*';
        # proxy_set_header    Access-Control-Allow-Methods    'GET, POST, OPTIONS';
        # proxy_set_header    Access-Control-Allow-Headers    'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';

        # ws support
        proxy_http_version  1.1;
        proxy_set_header    Upgrade     \$http_upgrade;
        proxy_set_header    Connection  "upgrade";
    }
}
EOF
}
