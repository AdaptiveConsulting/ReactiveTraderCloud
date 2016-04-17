#!/usr/bin/env bash

build="<% cli.id %>"
container="<% image %>:<% major %>.<% minor %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
