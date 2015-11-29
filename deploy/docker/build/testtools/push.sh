#! /bin/bash

# get and control config
. ../../../config

if [[ $testtoolsContainer = "" ]];then
  echo "testtools-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vTesttools = "" ]];then
  echo "testtools-build: testtools version required, fill in adaptivetrader/deploy/config"
  exit 1
fi


# push
docker push $testtoolsContainer:$vTesttools
docker push $testtoolsContainer:latest
