#! /bin/bash

# We explore the kubernetes api and get the services in each namespace
# Only service marked with label public=true are managed by that script

# Fail fast
set -euo pipefail

# import help functions
. /opt/writeFunctions.sh

# get namespaces
# -sS: do not print download informations
# certs: the kubernetes certificate are put in
#        the container when kubernetes start them
# jq: tool to manage json with bash
namespaces=$(curl -sS \
  --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
  https://kubernetes.default/api/v1/namespaces \
  | jq -r '.items[] | .metadata.name')


# clean files
mkdir -p /servers
rm -rf /servers/*

# var to catch all services
result_log=""

for namespace in $namespaces
do
    result_log+="|| {ns:$namespace, ["

    servicesData=$(curl -sS \
      --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
      -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
      https://kubernetes.default/api/v1/namespaces/$namespace/services \
      | jq '.items[] ' \
      | jq 'select(.metadata.labels.public=="true")')


    services=$(echo $servicesData | jq -r '.metadata.name')
    for service in $services
    do
        selector="select(.metadata.name==\"$service\")"
        portsData=$(echo $servicesData | jq "$selector" | jq '.spec.ports[]')
        ports_names=$(echo $portsData | jq -r '.name')
        for port_name in $ports_names
        do
            selector="select(.name==\"$port_name\")"
            port_number=$(echo $portsData | jq "$selector" | jq -r '.port')

            createProxyConfiguration $service $port_name $port_number $namespace
            
            result_log+="$port_name, "
        done
    done
    
    result_log+="]}"
done

echo "NsGate reloaded, Services found are: $result_log"
