#! /bin/bash

id="<% cli.id %>"
image="<% base.mono.image %>:<% base.mono.major %>.<% base.mono.minor %>"

# fail fast
set -euo pipefail

docker push ${image}
docker push ${image}.${id}
