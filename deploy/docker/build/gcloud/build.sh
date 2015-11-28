#! /bin/bash

# get versions
. ../../../versions

if [[ $vDebian = "" ]];then
  echo "debian version required, fill in adaptivetrader/deploy/version"
  exit 1
fi

./warning.sh

mkdir -p ./build

# generate container folder
mkdir -p ./build

cp ./template.Dockerfile ./build/Dockerfile
sed -i "s/__VDEBIAN__/$vDebian/g"         ./build/Dockerfile

cp ./template.install.sh ./build/install.sh

docker build --no-cache -t weareadaptive/gcloud:latest ./build/.
docker tag weareadaptive/gcloud:latest weareadaptive/kubectl:latest
