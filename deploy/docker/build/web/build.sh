#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

# failfast
RUN_ON_CIRCLE_CI="${CIRCLECI}"
set -euo pipefail

# load configuration
this_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
root_directory="${this_directory}/../../../.."
. ${root_directory}/deploy/config

nodemodules_cache_container="rtc_nodemodules_cache_container"
npm_cache_container="rtc_npm_cache_container"
temp_image="weareadaptive/websrc"
temp_container="reactivetrader_npminstall"

# Build the dist folder
npminstall_dir="${this_directory}/npminstall"
npminstall_build_dir="${npminstall_dir}/build"
mkdir -p ${npminstall_build_dir}
rm -rf ${npminstall_build_dir}/*
cp -r ${root_directory}/src/client ${npminstall_build_dir}/
cp ${npminstall_dir}/Dockerfile ${npminstall_build_dir}/Dockerfile
sed -ie "s|__NODE_CONTAINER__|$nodeContainer|g" ${npminstall_build_dir}/Dockerfile
docker build --no-cache -t ${temp_image} ${npminstall_build_dir}/.

if [[ "$(docker ps -q -a --filter name=${temp_container})" != "" ]]
then
  if [[ "${RUN_ON_CIRCLE_CI}"  != "true" ]]
  then docker rm ${temp_container} > /dev/null || true
  fi
fi
docker run \
  --name ${temp_container} \
  -v ${npm_cache_container}://root/.npm \
  -v ${nodemodules_cache_container}://client/node_modules \
  ${temp_image}

if [[ -f dist ]];then rm -r dist; fi
docker cp ${temp_container}:/client/dist ${this_directory}/.
if [[ "${RUN_ON_CIRCLE_CI}"  != "true" ]]
then
  docker rm ${temp_container}
  docker rmi ${temp_image}
fi

# build nginx container
nginx_dir="${this_directory}/nginx"
nginx_build_dir="${nginx_dir}/build"
mkdir -p ${nginx_build_dir}

cp ${nginx_dir}/Dockerfile        ${nginx_build_dir}/Dockerfile
cp ${nginx_dir}/start.sh          ${nginx_build_dir}/start.sh
cp ${nginx_dir}/dev.nginx.conf    ${nginx_build_dir}/dev.nginx.conf
cp ${nginx_dir}/prod.nginx.conf   ${nginx_build_dir}/prod.nginx.conf
cp -r ${this_directory}/dist      ${nginx_build_dir}/dist

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ${nginx_build_dir}/Dockerfile
sed -ie "s|__WEB_VERSION__|$webContainer_major.$webContainer_minor.$build|g" ${nginx_build_dir}/prod.nginx.conf

docker build --no-cache -t $webContainer  ${nginx_build_dir}/.
docker tag $webContainer $webContainer.$build

rm -r ${this_directory}/dist
