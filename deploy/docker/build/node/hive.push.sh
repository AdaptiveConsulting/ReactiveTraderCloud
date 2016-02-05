#! /bin/bash

build="<% args.build %>"
container="<% container.base.node %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
