#! /bin/bash

# get and control config
. ../../../config

if [[ $vNode = "" ]];then
  echo "node:build: node version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $nodeContainer = "" ]];then
  echo "node:build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

docker push $nodeContainer:$vNode
