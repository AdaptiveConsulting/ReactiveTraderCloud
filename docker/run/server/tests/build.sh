#!/usr/bin/env bash

version="1.0.0-rc1-final"   #TODO: need to get version from src/global.json
containerPath="./container"


mkdir -p $containerPath
rsync -aq ../../../../src/server $containerPath/

sed "s/__VERSION__/$version/g" template.Dockerfile > $containerPath/Dockerfile

docker build -t weareadaptive/reactive-trader-server $containerPath/.
