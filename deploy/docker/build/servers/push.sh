#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi


# get and control config
. ../../../config

if [[ $serversContainer = "" ]];then
  echo "servers-push: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMajor = "" ]];then
  echo "servers-push: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "servers-push: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# build
docker push $serversContainer:latest
docker push $serversContainer:$vMajor.$vMinor.$build
