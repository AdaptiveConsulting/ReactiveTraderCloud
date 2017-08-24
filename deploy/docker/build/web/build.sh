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
npminstall_dir="./npminstall"
npminstall_build_dir="${npminstall_dir}/build"

mkdir -p ${npminstall_build_dir}
rm -rf ${npminstall_build_dir}/*

cp ${npminstall_dir}/npminstall.sh  ${npminstall_build_dir}/npminstall.sh
cp ${npminstall_dir}/Dockerfile     ${npminstall_build_dir}/Dockerfile
cp -r ../../../../src/client/       ${npminstall_build_dir}/client

sed -ie "s|__NODE_CONTAINER__|$nodeContainer|g" ${npminstall_build_dir}/Dockerfile

docker build --no-cache -t weareadaptive/websrc:$build  ${npminstall_build_dir}/.

# run the build container sharing the cache folder
# the src are not directly shared as their is an error of synchronisation
#   when node_modules tryied to be synced between container/VM and Host on windows
docker run              \
  -v /$(pwd)/.npm:/.npm \
  -v /$(pwd)/dist:/dist \
  weareadaptive/websrc:$build

# build nginx container
nginx_dir="./nginx"
nginx_build_dir="${nginx_dir}/build"
mkdir -p ${nginx_build_dir}

cp ${nginx_dir}/Dockerfile        ${nginx_build_dir}/Dockerfile
cp ${nginx_dir}/start.sh          ${nginx_build_dir}/start.sh
cp ${nginx_dir}/dev.nginx.conf    ${nginx_build_dir}/dev.nginx.conf
cp ${nginx_dir}/prod.nginx.conf   ${nginx_build_dir}/prod.nginx.conf
cp -r ./dist                      ${nginx_build_dir}/dist

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ${nginx_build_dir}/Dockerfile

docker build --no-cache -t $webContainer  ${nginx_build_dir}/.
docker tag $webContainer $webContainer.$build
