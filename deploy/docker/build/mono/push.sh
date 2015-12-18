#! /bin/bash

set -euo pipefail

# get and control config
. ../../../config

docker push $monoContainer:$vDnx
