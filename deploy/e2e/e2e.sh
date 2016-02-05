#!/bin/bash

build_id=$1
if [[ $1 == "" ]];then
  build_id="e2e"
fi

# fail fast
set -euo pipefail

startTime=$(date)

chmod 755 ./ensurePermissions.sh
./ensurePermissions.sh

./buildContainers.sh $build_id
./runContainers.sh $build_id

echo "Giving some time for services to start"
sleep 10

./testContainers.sh $build_id
./stopContainers.sh $build_id

echo " "
echo "============="
echo "Time details:"
echo $startTime
date
