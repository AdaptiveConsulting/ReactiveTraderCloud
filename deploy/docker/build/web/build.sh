#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# load configuration
this_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
root_directory="${this_directory}/../../../.."
. ${root_directory}/deploy/config

# Build the dist folder
npminstall_dir="${this_directory}npminstall"
npminstall_build_dir="${npminstall_dir}/build"

mkdir -p ${npminstall_build_dir}
rm -rf ${npminstall_build_dir}/*

cp ${npminstall_dir}/npminstall.sh  ${npminstall_build_dir}/npminstall.sh
cp ${npminstall_dir}/Dockerfile     ${npminstall_build_dir}/Dockerfile
cp -r ${root_directory}/src/client/ ${npminstall_build_dir}/client

sed -ie "s|__NODE_CONTAINER__|$nodeContainer|g" ${npminstall_build_dir}/Dockerfile

docker build --no-cache -t weareadaptive/websrc:$build  ${npminstall_build_dir}/.

# run the build container sharing the cache folder
# the src are not directly shared as their is an error of synchronisation
#   when node_modules tryied to be synced between container/VM and Host on windows
docker run              \
  -v /${this_directory}/.npm:/.npm \
  -v /${this_directory}/dist:/dist \
  weareadaptive/websrc:$build

# build nginx container
nginx_dir="${this_directory}/nginx"
nginx_build_dir="${nginx_dir}/build"
mkdir -p ${nginx_build_dir}

cp ${nginx_dir}/Dockerfile        ${nginx_build_dir}/Dockerfile
cp ${nginx_dir}/start.sh          ${nginx_build_dir}/start.sh
cp ${nginx_dir}/dev.nginx.conf    ${nginx_build_dir}/dev.nginx.conf
cp ${nginx_dir}/prod.nginx.conf   ${nginx_build_dir}/prod.nginx.conf
cp -r ${this_directory}dist       ${nginx_build_dir}/dist

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ${nginx_build_dir}/Dockerfile
sed -ie "s|__WEB_VERSION__|$webContainer_major$webContainer_minor$build|g" ${nginx_build_dir}/prod.nginx.conf

docker build --no-cache -t $webContainer  ${nginx_build_dir}/.
docker tag $webContainer $webContainer.$build
