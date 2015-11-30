#!/usr/bin/env bash

# get and control config
. ../../../config

if [[ $serversContainer = "" ]];then
  echo "servers-push: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vDnx = "" ]];then
  echo "servers-push: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vDnx = "" ]];then
  echo "servers-push: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vDnx = "" ]];then
  echo "servers-push: build number required, fill in adaptivetrader/deploy/config"
  exit 1
fi


# build
docker push $serversContainer:latest
docker push $serversContainer:$vMajor.$vMinor.$vBuild
