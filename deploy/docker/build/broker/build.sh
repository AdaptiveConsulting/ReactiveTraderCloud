#!/bin/bash

build=$1
if [[ $build = "" ]];then
  echo "broker-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

mkdir -p ./build

cp  ./template.Dockerfile                              ./build/Dockerfile
sed -ie "s|__CROSSBAR_CONTAINER__|$crossbarContainer|g" ./build/Dockerfile

# get files from project
cp -r ../../../../src/server/.crossbar  ./build/.crossbar

docker build --no-cache -t $brokerContainer ./build/.
docker tag $brokerContainer $brokerContainer.$build
