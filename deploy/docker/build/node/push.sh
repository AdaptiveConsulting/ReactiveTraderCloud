#! /bin/bash

# get versions
. ../../../versions

if [[ $vNode = "" ]];then
  echo "node version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

docker push weareadaptive/node:$vNode
