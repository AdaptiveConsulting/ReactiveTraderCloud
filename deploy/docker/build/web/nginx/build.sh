#!/bin/bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# failfast
set -euo pipefail

. ../../../../config

echo "build nginx container to host the dist ..."
mkdir -p build

cp template.Dockerfile build/Dockerfile
cp dev.nginx.conf      build/dev.nginx.conf
cp prod.nginx.conf     build/prod.nginx.conf
cp -r ../dist          build/dist

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" build/Dockerfile

docker build --no-cache -t $webContainer  build/.
docker tag -f $webContainer $webContainer.$build
