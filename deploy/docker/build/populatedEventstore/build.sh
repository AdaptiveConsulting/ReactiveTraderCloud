#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "populate-eventstore-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# load configuration
this_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
root_directory="${this_directory}/../../../.."
. ${root_directory}/deploy/config

# run eventstore
eventstore_id_file="${this_directory}/eventstore_id"
docker run -d --net=host $eventstoreContainer > ${eventstore_id_file}

# populate it
populate_command=`cat "${root_directory}/src/server/Populate Event Store.bat"`
docker run -t --net=host      \
     $serversContainer.$build \
     ${populate_command}

# commit container
docker commit `cat ${eventstore_id_file}` $populatedEventstoreContainer
docker tag $populatedEventstoreContainer $populatedEventstoreContainer.$build

docker kill `cat ${eventstore_id_file}`
