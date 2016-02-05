#! /bin/bash

build="<% args.build %>"
container="<% container.reactivetrader.eventstore %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
