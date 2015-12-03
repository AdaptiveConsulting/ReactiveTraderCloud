#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populate-eventstore-build: build number required as first parameter"
  exit 1
fi


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

# run eventstore
docker run -d --net=host $eventstoreContainer:$vEventstore > eventstore_id

# populate it
populateCommand=`cat "../../../../src/server/Populate Event Store.bat"`
docker run -d --net=host                      \
     $serversContainer:$vMajor.$vMinor.$build \
     $populateCommand > populate_id

sleep 7 && docker kill `cat populate_id` 

# commit container
docker commit `cat eventstore_id` $populatedEventstoreContainer:$vMajor.$vMinor.$build
docker tag -f $populatedEventstoreContainer:$vMajor.$vMinor.$build $populatedEventstoreContainer:latest

# stop eventstore
docker kill `cat eventstore_id`
