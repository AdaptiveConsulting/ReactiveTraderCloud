#! /bin/bash

# fail fast
set -euo pipefail

id="<% cli.id %>"
major="<% reactivetrader.broker.major %>"
minor="<% reactivetrader.broker.minor %>"
image="<% reactivetrader.broker.image %>:${major}.${minor}"

docker push ${image}
docker push ${image}.${id}
