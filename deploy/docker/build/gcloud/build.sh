#! /bin/bash

set -euo pipefail

# get and control config
. ../../../config

mkdir -p ./build

# generate container folder
mkdir -p ./build

sed "s/__VDEBIAN__/$vDebian/g" ./template.Dockerfile > ./build/Dockerfile
cp ./template.install.sh ./build/install.sh

docker build --no-cache -t $gcloudContainer:$vGcloud ./build/.
docker tag -f $gcloudContainer:$vGcloud $gcloudContainer:lastest
