#!/usr/bin/env bash

# get and control config
. ../../../config

if [[ $webContainer = "" ]];then
  echo "web-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMajor = "" ]];then
  echo "web-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "web-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vBuild = "" ]];then
  echo "web-build: build number required, fill in adaptivetrader/deploy/config"
  exit 1
fi

docker push $webContainer:$vMajor.$vMinor.$vBuild
docker push $webContainer:latest
