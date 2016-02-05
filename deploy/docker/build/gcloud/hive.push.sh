#! /bin/bash

build="<% args.build %>"
container="<% container.tooling.gcloud %>"

# fail fast
set -euo pipefail

docker push ${container}
docker push ${container}.${build}
