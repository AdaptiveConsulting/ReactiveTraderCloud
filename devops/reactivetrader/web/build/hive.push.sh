#!/usr/bin/env bash

build="<% cli.id %>"
major="<% reactivetrader.web.major %>"
minor="<% reactivetrader.web.minor %>"
container="<% reactivetrader.web.image %>:${major}.${minor}"


# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
