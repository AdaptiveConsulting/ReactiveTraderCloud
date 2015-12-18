#! /bin/bash

. ../../../config

if [[ $vUbuntu = "" ]];then
  echo "fluentd-build: ubuntu version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $fluentdContainer = "" ]];then
  echo "fluentd-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vFluentd = "" ]];then
  echo "fluentd-build: fluentd version required, fill in adaptivetrader/deploy/config"
  exit 1
fi

mkdir -p build

sed "s/__VUBUNTU__/$vUbuntu/g" template.Dockerfile > ./build/Dockerfile
cp template.install.sh ./build/install.sh

docker build -t $fluentdContainer:$vFluend ./build/.
docker tag -f $fluentdContainer:$vFluend $fluentdContainer:latest
