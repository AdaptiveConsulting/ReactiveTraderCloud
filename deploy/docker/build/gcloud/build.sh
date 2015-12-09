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
if [[ $vGcloud = "" ]];then
  echo "gcloud-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

mkdir -p ./build

# generate container folder
mkdir -p ./build

sed "s/__VDEBIAN__/$vDebian/g" ./template.Dockerfile > ./build/Dockerfile
cp ./template.install.sh ./build/install.sh

docker build --no-cache -t $gcloudContainer:$vGcloud ./build/.
docker tag -f $gcloudContainer:$vGcloud $gcloudContainer:lastest
