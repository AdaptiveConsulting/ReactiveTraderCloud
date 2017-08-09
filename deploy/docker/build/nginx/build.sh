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

# Dockerfile
mkdir -p ${this_directory}/build
cp ${this_directory}/template.Dockerfile ${this_directory}/build/Dockerfile
sed -ie "s|__OFFICIAL_NGINX_CONTAINER__|$officialNginxContainer|g" ${this_directory}/build/Dockerfile

# build image
docker build --no-cache -t $nginxContainer ${this_directory}/build/.
docker tag $nginxContainer $nginxContainer.$build
