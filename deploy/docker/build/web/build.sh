#!/usr/bin/env bash

# get and control config
. ../../../config

if [[ $vNode = "" ]];then
  echo "web-build: node version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vNginx = "" ]];then
  echo "web-build: nginx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $webContainer = "" ]];then
  echo "web-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $nodeContainer = "" ]];then
  echo "web-build: node container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMajor = "" ]];then
  echo "web-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "web-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vBuild = "" ]];then
  echo "web-build: build number required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# generate container folder
mkdir -p ./build
sed "s/__VNGINX__/$vNginx/g"    ./template.Dockerfile > ./build/Dockerfile

cp ./template.nginx.conf ./build/dev.nginx.conf
sed -i "s/__BROKER__/localhost/g"   ./build/dev.nginx.conf

cp ./template.nginx.conf ./build/prod.nginx.conf
sed -i "s/__BROKER__/broker/g"      ./build/prod.nginx.conf

# todo: remove the node dependency !
pushd ../../../../src/client 
npm install
npm run compile
popd

cp -r ../../../../src/client/dist ./build/dist

# build
docker build -t $webContainer:$vMajor.$vMinor.$vBuild ./build/.
docker tag -f $webContainer:$vMajor.$vMinor.$vBuild $webContainer:latest
