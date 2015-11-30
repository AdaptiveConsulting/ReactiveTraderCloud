#! /bin/bash

# get and control config
. ../../../config

if [[ $vEventstore = "" ]];then
  echo "eventstore-push: eventstore version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $eventstoreContainer = "" ]];then
  echo "eventstore-push: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# push
docker push $eventstoreContainer:$vEventstore
