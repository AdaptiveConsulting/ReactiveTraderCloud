#! /bin/bash

build="<% args.build %>"
container="<% container.base.mono %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
