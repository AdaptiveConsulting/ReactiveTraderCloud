#!/bin/bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# failfast
set -euo pipefail

. ../../../../config

echo "Build the dist folder ..."
mkdir -p build
rm -rf build/*
cp template.Dockerfile           build/Dockerfile
cp -r ../../../../../src/client/ build/client

sed -ie "s|__NODE_CONTAINER__|$nodeContainer|g" build/Dockerfile

echo "build the container that will generate the dist folder ..."
tempContainer="weareadaptive/websrc:$build"
docker build --no-cache -t $tempContainer build/.

echo "generate the dist folder ..."
websrc="websrc"
docker rm $websrc || true
docker run                                       \
  --name $websrc                                 \
  -v $npmCacheContainer://root/.npm              \
  -v $nodemodulesContainer://client/node_modules \
  $tempContainer

echo "copy the dist ..."
if [[ -f ../dist ]];then rm -r ../dist; fi
docker cp $websrc:/client/dist ..
