#! /bin/bash

# fail fast
set -euo pipefail

. ../../../config

docker push $nodeContainer:$vNode
