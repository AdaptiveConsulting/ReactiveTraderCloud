#! /bin/bash

# get and control config
. ../../../config

if [[ $vDnx = "" ]];then
  echo "mono-push: dnx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $monoContainer = "" ]];then
  echo "mono-push: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

docker push $monoContainer:$vDnx
