#! /bin/bash

# get versions
. ../../../versions

if [[ $vUbuntu = "" ]];then
  echo "ubuntu version required, fill in adaptivetrader/deploy/version"
  exit 1
fi


# push
docker push weareadaptive/testtools:$vTesttools
docker push weareadaptive/testtools:latest
