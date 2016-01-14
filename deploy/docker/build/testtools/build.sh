#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

mkdir -p ./build

cp ./template.Dockerfile ./build/Dockerfile

sed -ie "s/__UBUNTU_CONTAINER__/$ubuntuContainer/g" ./build/Dockerfile
sed -ie "s/__VJQ__/$vJq/g"                          ./build/Dockerfile

docker build --no-cache -t $testtoolsContainer ./build/.
docker tag -f $testtoolsContainer $testtoolsContainer.$build
docker tag -f $testtoolsContainer $testtoolsContainer_latest
