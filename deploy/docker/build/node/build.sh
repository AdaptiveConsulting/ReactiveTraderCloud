#! /bin/bash

set -euo pipefail

# get and control config
. ../../../config

mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g" ./template.Dockerfile > ./build/Dockerfile
sed "s/__VNODE__/$vNode/g" ./template.install.sh > ./build/install.sh

docker build --no-cache -t $nodeContainer:$vNode ./build/.
