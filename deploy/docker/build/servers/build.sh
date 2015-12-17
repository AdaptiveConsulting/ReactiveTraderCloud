#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

set -euo pipefail

# get and control config
. ../../../config

mkdir -p ./build
cp -r ../../../../src/server ./build/
sed "s/__VDNX__/$vDnx/g" ./template.Dockerfile > ./build/Dockerfile


# build
containerTaggedName="$serversContainer:$vMajor.$vMinor.$build"
docker build --no-cache -t $containerTaggedName ./build/.
docker tag -f $containerTaggedName $serversContainer:latest
