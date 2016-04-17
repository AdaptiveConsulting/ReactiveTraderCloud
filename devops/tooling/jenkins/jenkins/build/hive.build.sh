#!/usr/bin/env bash

build="<% cli.id %>"
container="<% image %>:<% major %>.<% minor %>"

# fail fast
set -euo pipefail

docker build -t ${container} .
docker tag ${container} ${container}.${build}
