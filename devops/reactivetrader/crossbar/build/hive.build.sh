#! /bin/bash

id="<% cli.id %>"
image="<% base.crossbar.image %>:<% base.crossbar.major %>.<% base.crossbar.minor %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${image} .
docker tag ${image} ${image}.${id}
