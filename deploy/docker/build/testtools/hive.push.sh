#!/usr/bin/env bash

build="<% args.build %>"
container="<% container.tooling.testtools %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${container} .
docker tag -f ${container} ${container}.${build}
