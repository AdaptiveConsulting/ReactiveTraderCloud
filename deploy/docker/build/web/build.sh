#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# get and control config
. ../../../config

# generate container folder
mkdir -p ./build
sed "s/__VNGINX__/$vNginx/g"    ./template.Dockerfile > ./build/Dockerfile

cp ./dev.nginx.conf  ./build/dev.nginx.conf
cp ./prod.nginx.conf ./build/prod.nginx.conf

# todo: remove the node dependency !
cd ../../../../src/client
npm install
npm run compile
cd ../../deploy/docker/build/web

cp -r ../../../../src/client/dist ./build/dist

# build
docker build --no-cache -t $webContainer:$vMajor.$vMinor.$build ./build/.
docker tag -f $webContainer:$vMajor.$vMinor.$build $webContainer:latest
