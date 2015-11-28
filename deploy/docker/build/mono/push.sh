#! /bin/bash

# get versions
. ../../../versions

if [[ $vUbuntu = "" ]];then
  echo "ubuntu version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

if [[ $vDnx = "" ]];then
  echo "dnx version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

docker push weareadaptive/mono:$vDnx
