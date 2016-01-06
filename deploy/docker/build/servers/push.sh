#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

# build
docker push $serversContainer
docker push $serversContainer:$build
