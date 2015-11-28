#! /bin/bash

# get versions
. ../../../versions

if [[ $vUbuntu = "" ]];then
  echo "ubuntu version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

if [[ $vEventstore = "" ]];then
  echo "eventstore version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

# push
docker push weareadaptive/eventstore:$vEventstore
