#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "broker-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# get and control config
. ../../../config

# generate container folder
mkdir -p ./build
sed "s/__VCROSSBAR__/$vCrossbar/g" ./template.Dockerfile > ./build/Dockerfile

# get files from project
cp -r ../../../../src/server/.crossbar  ./build/.crossbar


# build
containerTaggedName="$brokerContainer:$vMajor.$vMinor.$build"
docker build --no-cache -t $containerTaggedName ./build/.
