#! /bin/bash

build="<% cli.id %>"
major="<% reactivetrader.eventstore.major %>"
minor="<% reactivetrader.eventstore.minor %>"
container="<% reactivetrader.eventstore.image %>:${major}.${minor}"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
