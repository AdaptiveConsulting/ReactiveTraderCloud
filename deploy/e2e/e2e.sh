#! /bin/bash

build_id=$1
if [[ $1 == "" ]];then
  build_id="e2e"
fi

# fail fast
set -euo pipefail

./buildContainers $build_id
./runContainers   $build_id
./testContainers  $build_id
