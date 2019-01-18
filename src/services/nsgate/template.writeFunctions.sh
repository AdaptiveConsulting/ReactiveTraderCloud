#! /bin/bash

# DOC:
# - cors: https://gist.github.com/alexjs/4165271

# fail fast
set -euo pipefail

NSGATE_VERSION="__NSGATE_VERSION__"
CERTIFICATE="/etc/ssl/certificate.crt"
CERTIFICATE_KEY="/etc/ssl/certificate.key"

createProxyConfiguration() {
    service=$1
    port_name=$2
    port_number=$3
    namespace=$4

    mkdir -p /servers

    # Write file
    file_content="server {\n"
    file_content+="    server_name             ${port_name}-${namespace}.*;\n"
    if [[ "$port_number" == "80" ]]
    then
    file_content+="    listen                  80;\n"
    file_content+="    listen                  443 ssl;\n"
    file_content+="    ssl_certificate         ${CERTIFICATE};\n"
    file_content+="    ssl_certificate_key     ${CERTIFICATE_KEY};\n"
    else
    file_content+="    listen                  ${port_number};\n"
    fi
    file_content+="    location / {\n"
    file_content+="        # Miscalneous\n"
    file_content+="        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Version  \"${NSGATE_VERSION}\";\n"
    file_content+="        # Proxy\n"
    file_content+="        proxy_set_header    Host                \$host;\n"
    file_content+="        proxy_set_header    X-Real-IP           \$remote_addr;\n"
    file_content+="        proxy_set_header    X-Forwarded-Proto   \$scheme;\n"
    file_content+="        proxy_set_header    X-Forwarded-For     \$proxy_add_x_forwarded_for;\n"
    file_content+="        proxy_pass          http://${service}.${namespace}:${port_number};\n"
    file_content+="        # ws\n"
    file_content+="        proxy_http_version  1.1;\n"
    file_content+="        proxy_set_header    Upgrade     \$http_upgrade;\n"
    file_content+="        proxy_set_header    Connection  \"upgrade\";\n"
    file_content+="    }\n"
    file_content+="}\n"
    echo -e ${file_content} > "/servers/server.$port_name.$namespace"

    # 404
    file_content="server {\n"
    file_content+="    server_name _;\n"
    if [[ "$port_number" == "80" ]]
    then
    file_content+="    listen                  80 default_server;\n"
    file_content+="    listen                  443 ssl default_server;\n"
    file_content+="    ssl_certificate         ${CERTIFICATE};\n"
    file_content+="    ssl_certificate_key     ${CERTIFICATE_KEY};\n"
    else
    file_content+="    listen      $port_number default_server;\n"
    fi
    file_content+="    root        /www/404;\n"
    file_content+="    expires     1M;\n"
    file_content+="    error_page  404 /404.html;\n"
    file_content+="    location / {\n"
    file_content+="        add_header  X-ReactiveTraderCloud-Proxy-NsGate-Config   '404';\n"
    file_content+="        add_header  X-ReactiveTraderCloud-Proxy-NsGate-Version  \"__NSGATE_VERSION__\";\n"
    file_content+="        index   index.html;\n"
    file_content+="        rewrite ^/(.*)/$ /\$1 permanent;\n"
    file_content+="        try_files \"\${uri}.html\" \$uri \$uri/ =404;\n"
    file_content+="    }\n"
    file_content+="    location = /404.html {\n"
    file_content+="        internal;\n"
    file_content+="    }\n"
    file_content+="}\n"
    echo -e ${file_content} > "/servers/server.$port_number"
}
