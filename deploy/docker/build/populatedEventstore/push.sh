#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populated-eventstore-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# load configuration
root_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../../../.."
. ${root_directory}/deploy/config

docker push $populatedEventstoreContainer
docker push $populatedEventstoreContainer.$build
