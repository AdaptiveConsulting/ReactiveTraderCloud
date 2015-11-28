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


mkdir -p ./build
sed "s/__VUBUNTU__/$vUbuntu/g" ./template.Dockerfile > ./build/Dockerfile
sed "s/__VDNX__/$vDnx/g" ./template.install.sh > ./build/install.sh

docker build --no-cache -t weareadaptive/mono:$vDnx ./build/.
