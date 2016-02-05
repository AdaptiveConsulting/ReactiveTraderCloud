#!/usr/bin/env bash

build="<% args.build %>"
container="<% container.reactivetrader.web %>"


# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
