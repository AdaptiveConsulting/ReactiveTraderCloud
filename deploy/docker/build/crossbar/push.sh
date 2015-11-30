#! /bin/bash

# get and control config
. ../../../config

if [[ $vCrossbar = "" ]];then
  echo "crossbar-build: version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $crossbarContainer = "" ]];then
  echo "crossbar-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# build
docker push $crossbarContainer:$vCrossbar 
