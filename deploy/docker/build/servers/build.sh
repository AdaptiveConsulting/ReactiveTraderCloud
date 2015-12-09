#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

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
if [[ $vMajor = "" ]];then
  echo "servers-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "servers-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi


mkdir -p ./build
cp -r ../../../../src/server ./build/
sed "s/__VDNX__/$vDnx/g" ./template.Dockerfile > ./build/Dockerfile


# build
containerTaggedName="$serversContainer:$vMajor.$vMinor.$build"
docker build --no-cache -t $containerTaggedName ./build/.
docker tag -f $containerTaggedName $serversContainer:latest
