#!/usr/bin/env bash

build="<% args.build %>"
container="<% container.tooling.jenkins %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
