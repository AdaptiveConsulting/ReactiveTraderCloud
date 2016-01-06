#! /bin/bash

# fail fast
set -euo pipefail

. ../../../config

mkdir -p build

sed "s/__VUBUNTU__/$vUbuntu/g" template.Dockerfile > ./build/Dockerfile
cp template.install.sh ./build/install.sh

docker build -t $fluentdContainer:$vFluend ./build/.
