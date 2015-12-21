#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populate-eventstore-build: build number required as first parameter"
  exit 1
fi

set -euo pipefail

# get config
. ../../../config


# run eventstore
docker run -d --net=host $eventstoreContainer:$vEventstore > eventstore_id
echo "container $eventstore_id started"

# populate it
populateCommand=`cat "../../../../src/server/Populate Event Store.bat"`
docker run -d --net=host                      \
     $serversContainer:$vMajor.$vMinor.$build \
     $populateCommand > populate_id
echo "container $populate_id started"

echo "============="
echo "logs:"
echo " "
docker logs `cat populate_id`
docker logs `cat eventstore_id`
echo " "
echo "logs end"
echo "============="

sleep 7 && docker kill `cat populate_id` 

# commit container
docker commit `cat eventstore_id` $populatedEventstoreContainer:$vMajor.$vMinor.$build
docker tag -f $populatedEventstoreContainer:$vMajor.$vMinor.$build $populatedEventstoreContainer:latest

# stop eventstore
docker kill `cat eventstore_id`
