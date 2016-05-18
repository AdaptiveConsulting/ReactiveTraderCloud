#!/bin/bash

build="<% cli.id %>"
major="<% reactivetrader.web.major %>"
minor="<% reactivetrader.web.minor %>"
container="<% reactivetrader.web.image %>:${major}.${minor}"

# fail fast
set -euo pipefail

echo "Generate the dist folder ..."
./npminstall.sh

echo "build nginx container to host the dist ..."
cp nginx.Dockerfile Dockerfile
docker build --no-cache -t ${container} .
docker tag ${container} ${container}.${build}

rm -r dist
rm Dockerfile
