#! /bin/bash

# fail fast
set -euo pipefail

. ../../../config

# generate container folder
mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g"  ./template.Dockerfile > ./build/Dockerfile

# build
docker build --no-cache -t $testtoolsContainer:$vTesttools ./build/.
docker tag -f $testtoolsContainer:$vTesttools $testtoolsContainer:latest
