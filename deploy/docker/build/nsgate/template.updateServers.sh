#! /bin/bash

# We explore the kubernetes api and get the services 
#   that ask to be public

# Fail fast
set -euo pipefail



# get namespaces
# -sS: do not print download iformations
# certs: the kubernetes certificate are put in 
#        the container when kubernetes start them
# jq: tool to manage json with bash
namespaces=$(curl -sS \
  --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
  https://kubernetes.default/api/v1/namespaces \
  | jq -r '.items[] | .metadata.name')

# clean files
rm -rf /servers/*

# var to catch all services
allServices=""

for namespace in $namespaces
do

services=$(curl -sS \
  --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
  https://kubernetes.default/api/v1/namespaces/$namespace/services \
  | jq '.items[] ' \
  | jq 'select(.metadata.labels.public=="true")')

# === to delete
services=$(curl -sS \
  --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
  https://kubernetes.default/api/v1/namespaces/396/services \
  | jq '.items[] ' \
  | jq 'select(.metadata.labels.public=="true")')
# === to delete

for service in $services
do

ports=$(echo $service | jq '.spec.ports[]')

for port in $ports
do

name=$(echo $port | jq -r '.name')
portNumber=$(echo $port | jq -r '.port')

# HTTP proxy
if [[ $name == "http" ]];then
cat <<EOF > /servers/http.$service.$namespace 
server {
  listen $portNumber
  server_name $service-$namespace.__DOMAIN__;

  location / {
    proxy_pass http://$service.$namespace;
  }
}
EOF
allServices="$allServices -- $service-$namespace"
fi

# HTTPS proxy
if [[ $name == "http" ]];then
cat <<EOF > /servers/https.$service.$namespace 
server {
  listen $portNumber
  server_name $service-$namespace.__DOMAIN__;

  location / {
    proxy_pass http://$service.$namespace;
  }
}
EOF
allServices="$allServices -- $service-$namespace"
fi

# WS proxy
cat <<EOF > /servers/$service.$namespace 
EOF
# WSS proxy
cat <<EOF > /servers/$service.$namespace 
EOF


done
done
done

echo "Services found: $allServices"
