#!/usr/bin/env bash

set -euo pipefail

# get and control config
. ../../../config

# generate container folder
mkdir -p ./build
sed "s/__VNGINX__/$vNginx/g" ./template.Dockerfile > ./build/Dockerfile

# build
docker build --no-cache -t $nginxContainer:$vNginx ./build/.
