#! /bin/bash

# get and control config
. ../../../config

if [[ $vCrossbar = "" ]];then
  echo "broker-build: crossbar version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $brokerContainer = "" ]];then
  echo "broker-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMajor = "" ]];then
  echo "broker-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "broker-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vBuild = "" ]];then
  echo "broker-build: build number required, fill in adaptivetrader/deploy/config"
  exit 1
fi


# generate container folder
mkdir -p ./build
sed "s/__VCROSSBAR__/$vCrossbar/g" ./template.Dockerfile > ./build/Dockerfile

# get files from project
cp -r ../../../../src/server/.crossbar  ./build/.crossbar


# build
containerTaggedName="$brokerContainer:$vMajor.$vMinor.$vBuild"
docker build -t $containerTaggedName ./build/.
docker tag -f $containerTaggedName $brokerContainer:latest
