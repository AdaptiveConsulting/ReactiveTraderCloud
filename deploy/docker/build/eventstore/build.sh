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

# generate container folder
mkdir -p ./build

cp ./template.Dockerfile ./build/Dockerfile
sed -i "s/__VUBUNTU__/$vUbuntu/g"         ./build/Dockerfile
sed -i "s/__VEVENTSTORE__/$vEventstore/g" ./build/Dockerfile

cp ./template.install.sh ./build/install.sh
sed -i "s/__VEVENTSTORE__/$vEventstore/g" ./build/install.sh 

# build
docker build --no-cache                    \
  -t weareadaptive/eventstore:$vEventstore \
  ./build/.
