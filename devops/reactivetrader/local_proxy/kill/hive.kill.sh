#!/bin/bash
set -euo pipefail

container="<% local_proxy.name %>"

docker kill ${container}
docker rm   ${container}
