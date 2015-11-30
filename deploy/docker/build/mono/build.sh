#! /bin/bash

# get and control config
. ../../../config

if [[ $vUbuntu = "" ]];then
  echo "mono-build: ubuntu version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vDnx = "" ]];then
  echo "mono-build: dnx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $monoContainer = "" ]];then
  echo "mono-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g" ./template.Dockerfile > ./build/Dockerfile
sed "s/__VDNX__/$vDnx/g" ./template.install.sh > ./build/install.sh

docker build -t $monoContainer:$vDnx ./build/.
