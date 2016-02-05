#! /bin/bash

# fail fast
set -euo pipefail

build="<% args.build %>"
container="<% container.reactivetrader.broker %>"

docker push ${container}
docker push ${container}.${build}
