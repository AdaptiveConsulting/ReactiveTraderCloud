#!/usr/bin/env bash

# fail fast
set -euo pipefail

. ../../../config

# build
docker push $nginxContainer:$vNginx
