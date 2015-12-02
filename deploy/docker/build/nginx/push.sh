#!/usr/bin/env bash

# get and control config
. ../../../config

if [[ $nginxContainer = "" ]];then
  echo "nginx-push: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vNginx = "" ]];then
  echo "nginx-push: nginx version required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# build
docker push $nginxContainer:$vNginx
