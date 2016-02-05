#! /bin/bash

build="<% args.build %>"
container="<% container.base.mono %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${container} .
docker tag ${container} ${container}.${build}
