#!/bin/bash
set -euo pipefail

id="<% cli.id %>"
image="<% local_proxy.image %>:<% local_proxy.major %>.<% local_proxy.minor %>"
container="<% local_proxy.name %>"

docker kill ${container} 2&> /dev/null || true
docker rm   ${container} 2&> /dev/null || true
docker run -d \
  --net=host \
  --name ${container} \
  ${image}.${id}
