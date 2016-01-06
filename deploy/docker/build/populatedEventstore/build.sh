#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populate-eventstore-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

. ../../../config

# run eventstore
docker run -d --net=host $eventstoreContainer.$build > eventstore_id

# populate it
populateCommand=`cat "../../../../src/server/Populate Event Store.bat"`
docker run -t --net=host      \
     $serversContainer.$build \
     $populateCommand > populate_id

# commit container
docker commit `cat eventstore_id` $populatedEventstoreContainer
docker tag $populatedEventstoreContainer $populatedEventstoreContainer.$build

docker kill `cat eventstore_id`
