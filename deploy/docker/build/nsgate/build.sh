#!/usr/bin/env bash

if [[ $1 == "" ]];then
  echo "usage:"
  echo "  $0 BUILD"
  echo " "
  exit 1
fi
build=$1

set -euo pipefail

# get and control config
. ../../../config

# generate container folder
mkdir -p ./build
cp  ./template.Dockerfile       ./build/Dockerfile
sed -i "s/__VNGINX__/$vNginx/g" ./build/Dockerfile

cp  ./template.install.sh  ./build/install.sh
sed -i "s/__VJQ__/$vJq/g"  ./build/install.sh

cp nginx.conf   ./build/
cp bootstrap.sh ./build/
cp template.updateServers.sh         ./build/updateServers.sh

cp template.writeFunctions.sh        ./build/writeFunctions.sh
sed -i "s/__DOMAINNAME__/$domainName/g"  ./build/writeFunctions.sh

# build
docker build --no-cache -t $nsGateContainer:$vNsGateMajor.$vNsGateMinor.$build ./build/.
