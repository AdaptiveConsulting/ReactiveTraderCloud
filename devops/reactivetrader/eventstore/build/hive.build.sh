#! /bin/bash

id="<% cli.id %>"
image="<% base.eventstore.image %>:<% base.eventstore.major %>.<% base.eventstore.minor %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${image} .
docker tag ${image} ${image}.${id}
