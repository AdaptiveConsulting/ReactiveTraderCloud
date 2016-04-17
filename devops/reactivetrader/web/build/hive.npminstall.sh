#!/bin/bash

build="<% cli.id %>"
nodemodules_cache_container="<% volume.nodemodules_cache %>"
npm_cache_container="<% volume.npm_cache %>"

major="<% reactivetrader.broker.major %>"
minor="<% reactivetrader.broker.minor %>"
web_container="<% base.node.image %>:${major}.${minor}"

temp_image="weareadaptive/websrc"
temp_container="reactivetrader_npminstall"

# failfast
set -euo pipefail

cp -r ../../../../src/client .
cp npminstall.Dockerfile Dockerfile
docker build --no-cache -t ${temp_image} .

docker rm ${temp_container} 2&> /dev/null || true
docker run                                                \
  --name ${temp_container}                                \
  -v ${npm_cache_container}://root/.npm                   \
  -v ${nodemodules_cache_container}://client/node_modules \
  ${temp_image}

if [[ -f dist ]];then rm -r dist; fi
docker cp ${temp_container}:/client/dist .

# clean up
docker rm ${temp_container}
docker rmi ${temp_image}
rm -r client
