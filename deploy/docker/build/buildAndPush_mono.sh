#! /bin/bash

if [[ $1 = "" ]];then
  echo "you must give version as parameter."
  echo "  ie: ./buildAndPush_mono.sh 1.0.0-beta8"
  exit 1
fi

version=$1

pushd mono.net
./build.sh $version
docker push weareadaptive/mono.net:$version
popd
