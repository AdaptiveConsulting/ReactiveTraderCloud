#! /bin/bash

# get and control config
. ../../../config

if [[ $vUbuntu = "" ]];then
  echo "crossbar-build: ubuntu version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vCrossbar = "" ]];then
  echo "crossbar-build: version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $crossbarContainer = "" ]];then
  echo "crossbar-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi


# generate container folder
mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g" ./template.Dockerfile > ./build/Dockerfile
cp ./template.install.sh ./build/install.sh

# build
docker build -t $crossbarContainer:$vCrossbar ./build/.
