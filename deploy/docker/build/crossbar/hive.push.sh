#! /bin/bash

build="<% args.build %>"
container="<% container.base.crossbar %>"
# fail fast
set -euo pipefail

docker push ${container} 
docker push ${container}.${build} 
