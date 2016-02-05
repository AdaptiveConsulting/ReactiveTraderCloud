#!/usr/bin/env bash

build="<% args.build %>"
container="<% container.tooling.jenkins %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${container} .
docker tag ${container} ${container}.${build}
