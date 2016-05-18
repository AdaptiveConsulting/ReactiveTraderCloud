#!/usr/bin/env bash

id="<% cli.id %>"
major="<% reactivetrader.servers.major %>"
minor="<% reactivetrader.servers.minor %>"
servers_image="<% reactivetrader.servers.image %>:${major}.${minor}"
dnupackage_volume="<% volume.dnu_cache %>"

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
command+=" && cp -r ${package_folder} /root/.dnx/"
command+=" && dnu restore"
command+=" && cp -r /root/.dnx/packages /"
docker rm ${temp_container} 2&> /dev/null || true
docker run                                   \
  --name ${temp_container}                   \
  -v ${dnupackage_volume}:/${package_folder} \
  ${temp_image}                              \
  bash -c "${command}"

# commit
docker commit ${temp_container} ${servers_image}
docker tag ${servers_image} ${servers_image}.${id}

# clean up
docker rm ${temp_container}
docker rmi ${temp_image}
rm -r server
