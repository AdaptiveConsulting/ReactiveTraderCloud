#!/usr/bin/env bash

id="<% cli.id %>"
major="<% reactivetrader.servers.major %>"
minor="<% reactivetrader.servers.minor %>"
image="<% reactivetrader.servers.image %>:${major}.${minor}"

# fail fast
set -euo pipefail

docker push ${image}
docker push ${image}.${id}
