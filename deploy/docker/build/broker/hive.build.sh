#!/bin/bash

# fail fast
set -euo pipefail

build="<% args.build %>"
container="<% container.reactivetrader.broker %>"

# get files from project
cp -r ../../../../src/server/.crossbar  .

docker build --no-cache -t ${container} .
docker tag ${container} ${container}.${build}

rm -r .crossbar
