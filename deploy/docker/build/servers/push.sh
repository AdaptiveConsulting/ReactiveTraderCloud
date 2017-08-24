#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# load configuration
root_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../../../.."
. ${root_directory}/deploy/config

docker push $serversContainer
docker push $serversContainer.$build
