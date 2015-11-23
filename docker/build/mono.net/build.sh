#! /bin/bash

if [[ $1 = "" ]];then
  echo "you must give version as parameter."
  echo "  ie: ./build.sh 1.0.0-beta8"
  exit 1
fi

version=$1

mkdir -p ./build
sed "s/__VERSION__/$version/g" ./template.Dockerfile > ./build/Dockerfile
sed "s/__VERSION__/$version/g" ./template.install.sh > ./build/install.sh

docker build --no-cache -t weareadaptive/mono.net:$version ./build/.
