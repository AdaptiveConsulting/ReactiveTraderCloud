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
allServices=""

for namespace in $namespaces
do
    echo "processing namespace $namespace"
    servicesData=$(curl -sS \
      --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
      -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
      https://kubernetes.default/api/v1/namespaces/$namespace/services \
      | jq '.items[] ' \
      | jq 'select(.metadata.labels.public=="true")')
    
    
    services=$(echo $servicesData | jq -r '.metadata.name')
    for service in $services
    do
        echo "processing service $service"
        selector="select(.metadata.name==\"$service\")"
        portsData=$(echo $servicesData | jq "$selector" | jq '.spec.ports[]')
        ports=$(echo $portsData | jq -r '.name')
        for port in $ports
        do
            selector="select(.name==\"$port\")"
            portNumber=$(echo $portsData | jq "$selector" | jq -r '.port')
            echo "processing port $port - $portNumber"
            
            if [[ $port == "http" ]];then
            createHttpFile $portNumber $service $namespace
            allServices="$allServices -- $service-$namespace"
            fi
            
            if [[ $port == "ws" ]];then
            createWsFile $portNumber $service $namespace
            allServices="$allServices -- $service-$namespace"
            fi
            
            if [[ $port == "https" ]];then
            createHttpsFile $portNumber $service $namespace
            allServices="$allServices -- $service-$namespace"
            fi
            
            if [[ $port == "wss" ]];then
            createWssFile $portNumber $service $namespace
            allServices="$allServices -- $service-$namespace"
            fi
        done
    done
done

echo "Services found: $allServices"

