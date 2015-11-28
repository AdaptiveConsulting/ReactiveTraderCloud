#!/usr/bin/env bash

if [[ ! -f jq ]];then
  echo "downloading jq to manage json (~2Mb)"
  curl -L -o jq https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64
  chmod 755 jq
fi

# Get parameters
version=`cat ../../../../src/server/global.json | jq '.sdk.version' | sed 's/"//g'`
containerPath="./container"

# sync server src
mkdir -p $containerPath
rsync -aq ../../../../src/server $containerPath/

# generate Dockerfile from template
sed "s/__VERSION__/$version/g" template.Dockerfile > $containerPath/Dockerfile

# build
docker build -t weareadaptive/at-servers $containerPath/.
