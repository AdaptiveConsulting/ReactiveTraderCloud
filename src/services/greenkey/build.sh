#!/bin/bash

build=$1
if [[ $build = "" ]];then
  echo "broker-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# load configuration
this_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
root_directory="$this_directory/../../../.."
. $root_directory/deploy/config

# create Dockerfile
cp  $this_directory/template.Dockerfile $this_directory/Dockerfile
sed -ie "s|__FROM_CONTAINER__|$ubuntu_container|g" $this_directory/Dockerfile

name=reactivetrader/greenkey-custom-intents:0.0
docker build --no-cache -t $name $this_directory/.
docker tag $name $name.$build
