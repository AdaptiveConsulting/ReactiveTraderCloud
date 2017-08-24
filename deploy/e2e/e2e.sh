#!/bin/bash

build_id=$1
if [[ $1 == "" ]];then
  build_id="e2e"
fi

# fail fast
set -euo pipefail

startTime=$(date)

root_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
chmod 755 ${root_directory}/deploy/e2e/ensurePermissions
${root_directory}/deploy/e2e/ensurePermissions

${root_directory}/deploy/e2e/buildContainers $build_id
${root_directory}/deploy/e2e/runContainers $build_id

echo "Giving some time for services to start"
sleep 10

${root_directory}/deploy/e2e/testContainers $build_id
${root_directory}/deploy/e2e/stopContainers $build_id

echo " "
echo "============="
echo "Time details:"
echo $startTime
date
