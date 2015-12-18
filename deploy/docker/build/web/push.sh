#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "web-build: build number required as first parameter"
  exit 1
fi

set -euo pipefail

. ../../../config

docker push $webContainer:$vMajor.$vMinor.$build
docker push $webContainer:latest
