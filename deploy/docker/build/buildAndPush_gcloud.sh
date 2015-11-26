#! /bin/bash

pushd gcloud
./build.sh
docker push weareadaptive/gcloud
popd
