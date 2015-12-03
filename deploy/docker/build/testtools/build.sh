#! /bin/bash

# get and control config
. ../../../config

if [[ $vUbuntu = "" ]];then
  echo "testtools-build: ubuntu version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $testtoolsContainer = "" ]];then
  echo "testtools-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vTesttools = "" ]];then
  echo "testtools-build: testtools version required, fill in adaptivetrader/deploy/config"
  exit 1
fi

# generate container folder
mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g"  ./template.Dockerfile > ./build/Dockerfile

# build
docker build --no-cache -t $testtoolsContainer:$vTesttools ./build/.
docker tag -f $testtoolsContainer:$vTesttools $testtoolsContainer:latest
