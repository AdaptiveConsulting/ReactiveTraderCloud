#! /bin/bash

id="<% cli.id %>"
image="<% base.node.image %>:<% base.node.major %>.<% base.node.minor %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${image} .
docker tag ${image} ${image}.${id}
