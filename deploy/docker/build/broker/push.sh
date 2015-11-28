#! /bin/bash

# get versions
. ../../../versions

if [[ $vCrossbar = "" ]];then
  echo "crossbar version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

# build
docker push adaptivetrader/broker:$vMajor.$vMinor.$vBuild
