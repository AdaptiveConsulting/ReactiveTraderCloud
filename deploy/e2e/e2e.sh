#!/bin/bash

build_id=$1
if [[ $1 == "" ]];then
  build_id="e2e"
fi

# fail fast
set -euo pipefail

startTime=$(date)

for file in ./{build,run}Containers; do
  [ -r "$file" ] && exec "$file" $build_id;
done
unset file

echo "Giving some time for services to start"
sleep 10

for file in ./{test,stop}Containers; do
  [ -r "$file" ] && exec "$file" $build_id
done
unset file

echo " "
echo "============="
echo "Time details:"
echo $startTime
date
