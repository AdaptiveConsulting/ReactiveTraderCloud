#! /bin/bash

id="<% cli.id %>"
image="<% base.node.image %>:<% base.node.major %>.<% base.node.minor %>"

# fail fast
set -euo pipefail

docker push ${image}
docker push ${image}.${id}
