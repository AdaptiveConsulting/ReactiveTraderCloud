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

# prepare cache
dnupackage="dnupackage"
docker volume create --name=$dnupackage

cp -r ../../../../src/server ./build/

cp  ./template.Dockerfile                       ./build/Dockerfile
sed -ie "s|__MONO_CONTAINER__|$monoContainer|g" ./build/Dockerfile
sed -ie "s/__VDNX__/$vDnx/g"                    ./build/Dockerfile

# build
docker build --no-cache -t weareadaptive/serverssrc:$build ./build/.

# restore package
dnurestored="dnurestored"
command="mkdir -p /packages"
command="$command && cp -r /packages /root/.dnx/"
command="$command && dnu restore"
command="$command && cp -r /root/.dnx/packages /"
docker rm $dnurestored || true
docker run -t                     \
  --name $dnurestored             \
  -v $dnupackage:/packages        \
  weareadaptive/serverssrc:$build \
  bash -c "$command"

# commit
docker commit $dnurestored $serversContainer
docker tag -f $serversContainer $serversContainer.$build
