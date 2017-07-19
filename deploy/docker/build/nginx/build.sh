#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

mkdir -p ./build

cp ./template.Dockerfile ./build/Dockerfile

sed -ie "s|__OFFICIAL_NGINX_CONTAINER__|$officialNginxContainer|g" ./build/Dockerfile

# build
docker build --no-cache -t $nginxContainer ./build/.
docker tag $nginxContainer $nginxContainer.$build
