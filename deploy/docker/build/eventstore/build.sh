#! /bin/bash

# get and control config
. ../../../config

if [[ $vUbuntu = "" ]];then
  echo "eventstore-build: ubuntu version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vEventstore = "" ]];then
  echo "eventstore-build: eventstore version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $eventstoreContainer = "" ]];then
  echo "eventstore-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# generate container folder
mkdir -p ./build

cp ./template.Dockerfile ./build/Dockerfile
sed -i "s/__VUBUNTU__/$vUbuntu/g"         ./build/Dockerfile
sed -i "s/__VEVENTSTORE__/$vEventstore/g" ./build/Dockerfile

cp ./template.install.sh ./build/install.sh
sed -i "s/__VEVENTSTORE__/$vEventstore/g" ./build/install.sh 

# build
docker build -t $eventstoreContainer:$vEventstore ./build/.
