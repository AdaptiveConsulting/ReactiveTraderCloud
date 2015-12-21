#! /bin/bash

# fail fast
set -euo pipefail

# get and control config
. ../../../config

# generate container folder
mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g" ./template.Dockerfile > ./build/Dockerfile
cp ./template.install.sh ./build/install.sh

# build
docker build --no-cache -t $crossbarContainer:$vCrossbar ./build/.
