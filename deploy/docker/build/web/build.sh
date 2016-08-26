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
cp npminstall/npminstall.sh        ./npminstall/build/npminstall.sh
cp npminstall/template.Dockerfile  ./npminstall/build/Dockerfile
cp -r ../../../../src/client/      ./npminstall/build/client

sed -ie "s|__NODE_CONTAINER__|$nodeContainer|g" ./npminstall/build/Dockerfile

docker build --no-cache -t weareadaptive/websrc:$build  ./npminstall/build/.

# run the build container sharing the cache folder
# the src are not directly shared as their is an error of synchronisation
#   when node_modules tryied to be synced between container/VM and Host on windows
docker run              \
  -v /$(pwd)/.npm:/.npm \
  -v /$(pwd)/dist:/dist \
  weareadaptive/websrc:$build

# build nginx container
mkdir -p ./nginx/build

cp ./nginx/template.Dockerfile   ./nginx/build/Dockerfile
cp ./nginx/dev.nginx.conf        ./nginx/build/dev.nginx.conf
cp ./nginx/prod.nginx.conf       ./nginx/build/prod.nginx.conf
cp -r ./dist                     ./nginx/build/dist

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ./nginx/build/Dockerfile

docker build --no-cache -t $webContainer  ./nginx/build/.
docker tag $webContainer $webContainer.$build
