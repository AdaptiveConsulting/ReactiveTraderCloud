#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

mkdir -p ./build

# get source code
cp -r ../../../../src/server ./build/

cp  ./template.Dockerfile                      ./build/Dockerfile
sed -i "s|__MONO_CONTAINER__|$monoContainer|g" ./build/Dockerfile
sed -i "s/__VDNX__/$vDnx/g"                    ./build/Dockerfile

# build
docker build --no-cache -t weareadaptive/serverssrc:$build ./build/.

# restore package
docker rm dnurestored || true
buildCommand="mkdir -p /packages"
buildCommand="$buildCommand && cp -r /packages /root/.dnx/"
buildCommand="$buildCommand && dnu restore"
buildCommand="$buildCommand && cp -r /root/.dnx/packages /"
docker run -t --name dnurestored -v /$(pwd)/dnxcache:/packages weareadaptive/serverssrc:$build bash -c "$buildCommand" 

# commit
docker commit dnurestored $serversContainer
docker tag -f $serversContainer $serversContainer.$build