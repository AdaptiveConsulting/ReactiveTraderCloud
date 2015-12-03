#! /bin/bash

# get config
. ../../../config

if [[ $vEventstore = "" ]];then
  echo "populate-eventstore-build: eventstore version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $eventstoreContainer = "" ]];then
  echo "populate-eventstore-build: eventstore container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $serversContainer = "" ]];then
  echo "populate-eventstore-build: servers container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMajor = "" ]];then
  echo "populate-eventstore-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "populate-eventstore-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vBuild = "" ]];then
  echo "populate-eventstore-build: build number required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# push
docker push $populatedEventstoreContainer:$vMajor.$vMinor.$vBuild
docker push $populatedEventstoreContainer:latest
