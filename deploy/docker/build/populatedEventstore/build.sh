#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populate-eventstore-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# get config
. ../../../config

# run eventstore
docker run -d --net=host $eventstoreContainer:$vEventstore > eventstore_id
echo "container $(cat eventstore_id) started"

# populate it
populateCommand=`cat "../../../../src/server/Populate Event Store.bat"`
docker run -t --net=host                      \
     $serversContainer:$vMajor.$vMinor.$build \
     $populateCommand > populate_id
echo "container $(cat populate_id) started"

# commit container
echo -e "\ncommit"
docker commit `cat eventstore_id` $populatedEventstoreContainer:$vMajor.$vMinor.$build

# stop eventstore
echo -e "\nstop"
docker kill `cat eventstore_id`
