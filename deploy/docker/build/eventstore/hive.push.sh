#! /bin/bash

build="<% args.build %>"
container="<% container.base.eventstore %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
