#!/usr/bin/env bash

id="<% cli.id %>"
image="<% base.nginx.image %>:<% base.nginx.major %>.<% base.nginx.minor %>"

# fail fast
set -euo pipefail

docker push ${image}
docker push ${image}.${id}
