#! /bin/bash

. ../../../config

if [[ $gcloudContainer = "" ]];then
  echo "gcloud-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vGcloud = "" ]];then
  echo "gcloud-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi

docker push $gcloudContainer:$vGcloud
docker push $gcloudContainer:latest
