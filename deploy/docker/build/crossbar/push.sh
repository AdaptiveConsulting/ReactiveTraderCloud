#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "broker-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

docker push $crossbarContainer 
docker push $crossbarContainer.$build 
