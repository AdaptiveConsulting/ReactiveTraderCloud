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
sed -i "s/__UBUNTU_CONTAINER__/$ubuntuContainer/g" ./build/Dockerfile
sed -i "s/__VEVENTSTORE__/$vEventstore/g"          ./build/Dockerfile

cp ./template.install.sh                  ./build/install.sh
sed -i "s/__VEVENTSTORE__/$vEventstore/g" ./build/install.sh 

docker build --no-cache -t $eventstoreContainer ./build/.
docker tag $eventstoreContainer $eventstoreContainer.$build
