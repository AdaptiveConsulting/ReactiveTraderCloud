#! /bin/bash

# get versions
. ../../../versions

if [[ $vUbuntu = "" ]];then
  echo "ubuntu version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

# generate container folder
mkdir -p ./build

sed "s/__VUBUNTU__/$vUbuntu/g"  ./template.Dockerfile > ./build/Dockerfile


# build
docker build --no-cache                  \
  -t weareadaptive/testtools:$vTesttools \
  ./build/.

docker tag weareadaptive/testtools:$vTesttools weareadaptive/testtools:latest
