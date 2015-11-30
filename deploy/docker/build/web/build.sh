#!/usr/bin/env bash

# get and control config
. ../../../config

if [[ $vNode = "" ]];then
  echo "web-build: ubuntu version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $webContainer = "" ]];then
  echo "web-build: container name required, fill in adaptivetrader/deploy/config"
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
sed "s/__VNODE__/$vNode/g"  ./template.Dockerfile > ./build/Dockerfile
rsync -aq --exclude 'node_modules' ../../../../src/client ./build/

# build
docker build -t $webContainer:$vMajor.$vMinor.$vBuild ./build/.
docker tag -f $webContainer:$vMajor.$vMinor.$vBuild $webContainer:latest
