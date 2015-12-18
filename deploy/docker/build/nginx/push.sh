#!/usr/bin/env bash

set -euo pipefail

. ../../../config

# build
docker push $nginxContainer:$vNginx
