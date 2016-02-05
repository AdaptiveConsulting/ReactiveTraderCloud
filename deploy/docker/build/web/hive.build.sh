#!/bin/bash

build="<% args.build %>"
container="<% container.reactivetrader.web %>"

# fail fast
set -euo pipefail

echo "Generate the dist folder ..."
./npminstall.sh

echo "build nginx container to host the dist ..."
cp nginx.Dockerfile Dockerfile
docker build --no-cache -t ${container} .
docker tag ${container} ${container}.${build}

rm -r dist
rm DOckerfile
