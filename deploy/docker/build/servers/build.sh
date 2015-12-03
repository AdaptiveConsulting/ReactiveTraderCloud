#!/usr/bin/env bash

# get and control config
. ../../../config

if [[ $vDnx = "" ]];then
  echo "servers-build: dnx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $serversContainer = "" ]];then
  echo "servers-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vDnx = "" ]];then
  echo "servers-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vDnx = "" ]];then
  echo "servers-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vDnx = "" ]];then
  echo "servers-build: build number required, fill in adaptivetrader/deploy/config"
  exit 1
fi


mkdir -p ./build
rsync -aq ../../../../src/server ./build/
sed "s/__VDNX__/$vDnx/g" ./template.Dockerfile > ./build/Dockerfile


# build
containerTaggedName="$serversContainer:$vMajor.$vMinor.$vBuild"
docker build --no-cache -t $containerTaggedName ./build/.
docker tag -f $containerTaggedName $serversContainer:latest
