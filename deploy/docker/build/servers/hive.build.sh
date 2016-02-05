#!/usr/bin/env bash

build="<% args.build %>"
servers_container="<% container.reactivetrader.servers %>"
dnupackage_volume="<% volume.cache.dnu %>"

temp_image="weareadaptive/serverssrc"
temp_container="dnurestore"
package_folder="/packages"

# fail fast
set -euo pipefail

# get sources
cp -r ../../../../src/server .

# build
docker build --no-cache -t ${temp_image} .

# restore package
command="mkdir -p ${package_folder}"
command="${command} && cp -r ${package_folder} /root/.dnx/"
command="${command} && dnu restore"
command="${command} && cp -r /root/.dnx/packages /"
docker rm ${temp_container} || true
docker run -t                                \
  --name ${temp_container}                   \
  -v ${dnupackage_volume}:/${package_folder} \
  ${temp_image}                              \
  bash -c "${command}"

# commit
docker commit ${temp_container} ${servers_container}
docker tag ${servers_container} ${servers_container}.${build}

# clean up
docker rm ${temp_container}
docker rmi ${temp_image}
rm -r server
