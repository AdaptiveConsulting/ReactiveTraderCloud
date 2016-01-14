#!/usr/bin/env bash

if [[ $1 == "" ]];then
  echo "usage:"
  echo "  $0 BUILD"
  echo " "
  exit 1
fi
build=$1

# fail fast
set -euo pipefail

# get and control config
. ../../../config

# generate container folder
mkdir -p ./build

cp nginx.conf                 ./build/
cp bootstrap.sh               ./build/
cp install.sh                 ./build/
cp template.Dockerfile        ./build/Dockerfile
cp template.updateServers.sh  ./build/updateServers.sh
cp template.writeFunctions.sh ./build/writeFunctions.sh

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ./build/Dockerfile
sed -ie "s/__DOMAIN__/$domainName/g" ./build/writeFunctions.sh

docker build --no-cache -t $nsGateContainer ./build/.
docker tag -f $nsGateContainer $nsGateContainer.$build
