#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populate-eventstore-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

mkdir -p ./build

cp ./template.Dockerfile                           ./build/Dockerfile
sed -ie "s|__DEBIAN_CONTAINER__|$debianContainer|g" ./build/Dockerfile

cp ./template.install.sh ./build/install.sh

docker build --no-cache -t $gcloudContainer ./build/.
docker tag -f $gcloudContainer $gcloudContainer.$build
