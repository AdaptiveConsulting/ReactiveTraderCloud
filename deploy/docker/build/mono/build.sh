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

cp     ./template.Dockerfile                       ./build/Dockerfile
sed -ie "s|__UBUNTU_CONTAINER__|$ubuntuContainer|g" ./build/Dockerfile

cp     ./template.install.sh ./build/install.sh
sed -ie "s/__DOTNET_VERSION__/$vDotnet/g"  ./build/install.sh

docker build --no-cache -t $monoContainer ./build/.
docker tag -f $monoContainer $monoContainer.$build
