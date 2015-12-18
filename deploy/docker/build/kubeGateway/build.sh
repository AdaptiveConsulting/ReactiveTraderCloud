#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "gateway-build: build number required as first parameter"
  exit 1
fi

# get and control config
. ../../../config

if [[ $vNginx = "" ]];then
  echo "gateway-build: nginx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $kubeGatewayContainer = "" ]];then
  echo "gateway-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vKubeGateway = "" ]];then
  echo "gateway-build: version required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# generate container folder
mkdir -p ./build
sed "s/__VNGINX__/$vNginx/g"    ./template.Dockerfile > ./build/Dockerfile

cp ./nginx.conf ./build/nginx.conf

# build
docker build --no-cache -t $kubeGatewayContainer:$vKubeGateway ./build/.
docker tag -f $kubeGatewayContainer:$vKubeGateway $kubeGatewayContainer:$build
docker tag -f $kubeGatewayContainer:$vKubeGateway $kubeGatewayContainer:$vKubeGateway.$build
