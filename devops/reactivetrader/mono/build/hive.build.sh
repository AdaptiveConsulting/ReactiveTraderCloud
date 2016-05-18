#! /bin/bash

id="<% cli.id %>"
image="<% base.mono.image %>:<% base.mono.major %>.<% base.mono.minor %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${image} .
docker tag ${image} ${image}.${id}
