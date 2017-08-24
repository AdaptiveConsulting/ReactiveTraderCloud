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

    nginx_conf_file="/servers/server.$port_name.$namespace"
    mkdir -p /servers

    # Write file
    file_content="server {\n"
    file_content+="    server_name             ${port_name}-${namespace}.*;\n"
    file_content+="    listen                  ${port_number};\n"
    file_content+="\n"
    if [[ "$port_number" == "80" ]]
    then
    file_content+="    listen                  443 ssl;\n"
    file_content+="    ssl_certificate         ${CERTIFICATE};\n"
    file_content+="    ssl_certificate_key     ${CERTIFICATE_KEY};\n"
    file_content+="\n"
    fi

    file_content+="    location / {\n"
    file_content+="        # Miscalneous\n"
    file_content+="        add_header          X-ReactiveTraderCloud-Proxy-NsGate-Version  \"${NSGATE_VERSION}\";\n"
    file_content+="\n"
    file_content+="        # Proxy\n"
    file_content+="        proxy_set_header    Host                \$host;\n"
    file_content+="        proxy_set_header    X-Real-IP           \$remote_addr;\n"
    file_content+="        proxy_set_header    X-Forwarded-Proto   \$scheme;\n"
    file_content+="        proxy_set_header    X-Forwarded-For     \$proxy_add_x_forwarded_for;\n"
    file_content+="        proxy_pass          http://${service}.${namespace}:${port_number};\n"
    file_content+="\n"
    file_content+="        # ws\n"
    file_content+="        proxy_http_version  1.1;\n"
    file_content+="        proxy_set_header    Upgrade     \$http_upgrade;\n"
    file_content+="        proxy_set_header    Connection  \"upgrade\";\n"
    file_content+="    }\n"
    file_content+="}\n"

    echo -e ${file_content} > $nginx_conf_file
}
