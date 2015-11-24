#! /bin/bash

pushd node
./build.sh
docker push weareadaptive/node
popd
