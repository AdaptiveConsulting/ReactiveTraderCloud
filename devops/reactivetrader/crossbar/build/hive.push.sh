#! /bin/bash

id="<% cli.id %>"
image="<% base.crossbar.image %>:<% base.crossbar.major %>.<% base.crossbar.minor %>"

# fail fast
set -euo pipefail

docker push ${image}
docker push ${image}.${id}
