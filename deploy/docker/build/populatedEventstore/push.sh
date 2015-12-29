#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populated-eventstore-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

# push
docker push $populatedEventstoreContainer:$vMajor.$vMinor.$build
docker push $populatedEventstoreContainer:latest
