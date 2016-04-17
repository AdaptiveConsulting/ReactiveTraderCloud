#!/usr/bin/env bash

id="<% cli.id %>"
image="<% base.nginx.image %>:<% base.nginx.major %>.<% base.nginx.minor %>"

# fail fast
set -euo pipefail

docker build --no-cache -t ${image} .
docker tag ${image} ${image}.${id}
