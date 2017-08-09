#!/usr/bin/env bash

if [[ $1 == "" ]];then
  echo "usage:"
  echo "  $0 BUILD"
  echo " "
  exit 1
fi
build=$1

# fail fast
set -euo pipefail

# load configuration
this_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
root_directory="${this_directory}/../../../.."
. ${root_directory}/deploy/config

# generate container folder
mkdir -p ${this_directory}/build

cp ${this_directory}/template.nginx.conf    ${this_directory}/build/nginx.conf
cp ${this_directory}/template.Dockerfile    ${this_directory}/build/Dockerfile

minikubegate_version="$minikubegate_major.$minikubegate_minor.$build"
sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g"               ${this_directory}/build/Dockerfile
sed -ie "s/__MINIKUBEGATE_VERSION__/$minikubegate_version/g"    ${this_directory}/build/nginx.conf

docker build --no-cache -t $minikubegate_image ${this_directory}/build/.
docker tag $minikubegate_image $minikubegate_image.$build
