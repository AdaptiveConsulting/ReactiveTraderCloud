#!/usr/bin/env bash

# get and control config
. ../../../config

if [[ $vNginx = "" ]];then
  echo "nginx-build: nginx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $nginxContainer = "" ]];then
  echo "nginx-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# generate container folder
mkdir -p ./build
sed "s/__VNGINX__/$vNginx/g" ./template.Dockerfile > ./build/Dockerfile

# build
docker build --no-cache -t $nginxContainer:$vNginx ./build/.
