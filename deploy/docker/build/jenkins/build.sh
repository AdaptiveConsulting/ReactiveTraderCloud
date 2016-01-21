#!/usr/bin/env bash

if [[ $1 == "" ]];then
  echo "usage:"
  echo "  $0 BUILD"
  echo " "
  exit 1
fi
build=$1

# fail fast
set -euo pipefail

. ../../../config

mkdir -p ./build

cp template.Dockerfile   ./build/Dockerfile
cp volume-permissions.sh ./build/
cp plugins.txt           ./build/

docker build --no-cache -t $jenkinsContainer ./build/.
docker tag -f $jenkinsContainer $jenkinsContainer.$build
