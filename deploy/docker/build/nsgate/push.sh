#!/usr/bin/env bash

build="<% args.build %>"
container="<% container.tooling.nsgate %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
