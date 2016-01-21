#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

# Build the dist folder
mkdir -p ./npminstall/build
rm -rf ./npminstall/build/*
cp npminstall/template.Dockerfile  ./npminstall/build/Dockerfile
cp -r ../../../../src/client/      ./npminstall/build/client

sed -ie "s|__NODE_CONTAINER__|$nodeContainer|g" ./npminstall/build/Dockerfile

tempContainer="weareadaptive/websrc:$build"
docker build --no-cache -t $tempContainer ./npminstall/build/.

nodemodules="nodemodules"
docker volume create --name=$nodemodules

websrc="websrc"
docker rm $websrc || true
docker run                            \
  --name $websrc                      \
  -v nodemodules:/client/node_modules \
  $tempContainer

rm -r ./dist
docker cp $websrc:/client/dist .

# build nginx container
mkdir -p ./nginx/build

cp ./nginx/template.Dockerfile   ./nginx/build/Dockerfile
cp ./nginx/dev.nginx.conf        ./nginx/build/dev.nginx.conf
cp ./nginx/prod.nginx.conf       ./nginx/build/prod.nginx.conf
cp -r ./dist                     ./nginx/build/dist

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ./nginx/build/Dockerfile

docker build --no-cache -t $webContainer  ./nginx/build/.
docker tag -f $webContainer $webContainer.$build
