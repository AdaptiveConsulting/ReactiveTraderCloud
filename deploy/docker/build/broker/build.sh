#!/bin/bash

build=$1
if [[ $build = "" ]];then
  echo "broker-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# load configuration
this_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
root_directory="${this_directory}/../../../.."
. ${root_directory}/deploy/config

# create Dockerfile
mkdir -p "${this_directory}/build"
cp  ${this_directory}/template.Dockerfile ${this_directory}/build/Dockerfile
sed -ie "s|__CROSSBAR_CONTAINER__|$crossbarContainer|g" ${this_directory}/build/Dockerfile

# get files from project
cp -r ${root_directory}/src/server/.crossbar  ${this_directory}/build/.crossbar

docker build --no-cache -t $brokerContainer ${root_directory}/build/.
docker tag $brokerContainer $brokerContainer.$build
