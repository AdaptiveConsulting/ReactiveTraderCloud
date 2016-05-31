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

cp  ./template.Dockerfile                           ./build/Dockerfile
sed -ie "s|__DOTNET_CONTAINER__|$dotnetContainer|g" ./build/Dockerfile

# build
docker build --no-cache -t weareadaptive/serverssrc:$build ./build/.

# restore package
docker rm dotnetrestored || true

buildCommand="mkdir -p /packages"
buildCommand="$buildCommand && cp -r /packages /root/.nuget/"
buildCommand="$buildCommand && dotnet restore"
buildCommand="$buildCommand && cp -r /root/.nuget/packages /"

docker run -t --name dnurestored -v /$(pwd)/dotnetcache:/packages weareadaptive/serverssrc:$build bash -c "$buildCommand"

# commit
docker commit dnurestored $serversContainer
docker tag -f $serversContainer $serversContainer.$build
