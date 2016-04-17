#!/bin/bash

# fail fast
set -euo pipefail

id="<% cli.id %>"
major="<% reactivetrader.broker.major %>"
minor="<% reactivetrader.broker.minor %>"
image="<% reactivetrader.broker.image %>:${major}.${minor}"

# get files from project
cp -r ../../../../src/server/.crossbar  .

docker build --no-cache -t ${image} .
docker tag ${image} ${image}.${id}

rm -r .crossbar
