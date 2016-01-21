#!/usr/bin/env bash
build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

echo "Build the dist folder ..."
mkdir -p ./npminstall/build
rm -rf ./npminstall/build/*
cp npminstall/template.Dockerfile  ./npminstall/build/Dockerfile
cp -r ../../../../src/client/      ./npminstall/build/client

sed -ie "s|__NODE_CONTAINER__|$nodeContainer|g" ./npminstall/build/Dockerfile

echo "build the container that will generate the dist folder ..."
tempContainer="weareadaptive/websrc:$build"
docker build --no-cache -t $tempContainer ./npminstall/build/.

echo "create the data container that will store node_modules ..."
docker run                                \
  -v //client/node_modules                \
  --name=$nodemodulesContainer            \
  $ubuntuContainer                        \
  echo "persistence for the node_modules" \
  || true

echo "generate the dist folder ..."
websrc="websrc"
docker rm $websrc || true
docker run                             \
  --name $websrc                       \
  --volumes-from $nodemodulesContainer \
  $tempContainer

rm -r ./dist || true
echo "copy the dist ..."
docker cp $websrc:/client/dist .

echo "build nginx container to host the dist ..."
mkdir -p ./nginx/build

cp ./nginx/template.Dockerfile   ./nginx/build/Dockerfile
cp ./nginx/dev.nginx.conf        ./nginx/build/dev.nginx.conf
cp ./nginx/prod.nginx.conf       ./nginx/build/prod.nginx.conf
cp -r ./dist                     ./nginx/build/dist

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ./nginx/build/Dockerfile

docker build --no-cache -t $webContainer  ./nginx/build/.
docker tag -f $webContainer $webContainer.$build
