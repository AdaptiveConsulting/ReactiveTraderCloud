#! /bin/bash

id="<% cli.id %>"
image="<% base.eventstore.image %>:<% base.eventstore.major %>.<% base.eventstore.minor %>"

# fail fast
set -euo pipefail

docker push ${image}
docker push ${image}.${id}
