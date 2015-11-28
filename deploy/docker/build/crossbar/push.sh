#! /bin/bash

# get versions
. ../../../versions

if [[ $vUbuntu = "" ]];then
  echo "ubuntu version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

if [[ $vCrossbar = "" ]];then
  echo "crossbar version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

# build
docker push weareadaptive/crossbar:$vCrossbar 
