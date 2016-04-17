#!/bin/bash
set -euo pipefail

id="<% cli.id %>"
image="<% local_proxy.image %>:<% local_proxy.major %>.<% local_proxy.minor %>"

docker push ${image}
docker push ${image}.${id}
