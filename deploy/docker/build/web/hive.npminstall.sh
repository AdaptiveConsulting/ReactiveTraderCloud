#!/bin/bash

build="<% args.build %>"
nodemodules_cache_container="<% volume.cache.nodemodules %>"
npm_cache_container="<% volume.cache.npm %>"
web_container="<% container.base.node %>"

temp_image="weareadaptive/websrc"
temp_container="reactivetrader_dnurestore"

# failfast
set -euo pipefail

cp -r ../../../../src/client .
cp npminstall.Dockerfile Dockerfile
docker build --no-cache -t ${temp_image} .

docker rm ${temp_container} || true
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