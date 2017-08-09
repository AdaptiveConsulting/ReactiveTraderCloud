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

cp ${this_directory}/nginx.conf                 ${this_directory}/build/
cp ${this_directory}/bootstrap.sh               ${this_directory}/build/
cp ${this_directory}/install.sh                 ${this_directory}/build/
cp ${this_directory}/template.Dockerfile        ${this_directory}/build/Dockerfile
cp ${this_directory}/template.updateServers.sh  ${this_directory}/build/updateServers.sh
cp ${this_directory}/template.writeFunctions.sh ${this_directory}/build/writeFunctions.sh

sed -ie "s|__NGINX_CONTAINER__|$nginxContainer|g" ${this_directory}/build/Dockerfile
nsgate_version="$nsGateContainer_major.$nsGateContainer_minor.$build"
sed -ie "s/__NSGATE_VERSION__/$nsgate_version/g" ${this_directory}/build/writeFunctions.sh
sed -ie "s/__NSGATE_VERSION__/$nsgate_version/g" ${this_directory}/build/nginx.conf

docker build --no-cache -t $nsGateContainer ${this_directory}/build/.
docker tag $nsGateContainer $nsGateContainer.$build
