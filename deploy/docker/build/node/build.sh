#! /bin/bash

# get and control config
. ../../../config

if [[ $vUbuntu = "" ]];then
  echo "node:build: ubuntu version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vNode = "" ]];then
  echo "node:build: node version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $nodeContainer = "" ]];then
  echo "node:build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi


mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g" ./template.Dockerfile > ./build/Dockerfile
sed "s/__VNODE__/$vNode/g" ./template.install.sh > ./build/install.sh

docker build --no-cache -t $nodeContainer:$vNode ./build/.
