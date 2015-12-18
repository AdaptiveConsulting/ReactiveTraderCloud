#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

# get and control config
. ../../../config

if [[ $vDnx = "" ]];then
  echo "servers-build: dnx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $serversContainer = "" ]];then
  echo "servers-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMajor = "" ]];then
  echo "servers-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "servers-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi


mkdir -p ./build
cp -r ../../../../src/server ./build/
sed "s/__VDNX__/$vDnx/g" ./template.Dockerfile > ./build/Dockerfile

# build
docker build --no-cache -t weareadaptive/serverssrc:latest ./build/.

docker rm dnurestored
buildCommand="mkdir -p /packages"
buildCommand="$buildCommand && cp -r /packages /root/.dnx/packages"
buildCommand="$buildCommand && dnu restore"
buildCommand="$buildCommand && cp -r /root/.dnx/packages /packages"
docker run --name dnurestored -v /$(pwd)/dnxcache:/packages weareadaptive/serverssrc:latest bash -c "$buildCommand" 

containerTaggedName="$serversContainer:$vMajor.$vMinor.$build"
docker commit dnurestored $containerTaggedName 
docker tag -f $containerTaggedName $serversContainer:latest
