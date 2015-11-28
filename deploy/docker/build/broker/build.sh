#! /bin/bash

# get versions
. ../../../versions

if [[ $vCrossbar = "" ]];then
  echo "crossbar version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

# generate container folder
mkdir -p ./build
sed "s/__VCROSSBAR__/$vCrossbar/g" ./template.Dockerfile > ./build/Dockerfile

# get files from project
cp -r ../../../../src/server/.crossbar  ./build/.crossbar

# build
docker build --no-cache                            \
  -t adaptivetrader/broker:$vMajor.$vMinor.$vBuild \
  ./build/.
