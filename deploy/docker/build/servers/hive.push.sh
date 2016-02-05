#!/usr/bin/env bash

build="<% args.build %>"
container="<% container.reactivetrader.servers %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
