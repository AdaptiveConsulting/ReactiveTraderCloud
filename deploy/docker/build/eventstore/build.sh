#! /bin/bash

set -euo pipefail

# get and control config
. ../../../config

# generate container folder
mkdir -p ./build

cp ./template.Dockerfile ./build/Dockerfile
sed -i "s/__VUBUNTU__/$vUbuntu/g"         ./build/Dockerfile
sed -i "s/__VEVENTSTORE__/$vEventstore/g" ./build/Dockerfile

cp ./template.install.sh ./build/install.sh
sed -i "s/__VEVENTSTORE__/$vEventstore/g" ./build/install.sh 

# build
docker build --no-cache -t $eventstoreContainer:$vEventstore ./build/.
