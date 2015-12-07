#! /bin/bash

# get and control config
. ../../../config

if [[ $vDebian = "" ]];then
  echo "gcloud-build: debian version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $gcloudContainer = "" ]];then
  echo "gcloud-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $kubectlContainer = "" ]];then
  echo "gcloud-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

./warning.sh

mkdir -p ./build

# generate container folder
mkdir -p ./build

sed -i "s/__VDEBIAN__/$vDebian/g" ./template.Dockerfile > ./build/Dockerfile
cp ./template.install.sh ./build/install.sh

docker build --no-cache -t $gcloudContainer:latest ./build/.
docker tag -f $gcloudContainer:latest $kubectlContainer:latest
