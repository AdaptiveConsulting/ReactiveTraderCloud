#! /bin/bash

set -euo pipefail

. ../../../config

docker push $nodeContainer:$vNode
