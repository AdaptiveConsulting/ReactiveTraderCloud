#! /bin/bash

set -euo pipefail

# get and control config
. ../../../config

# build
docker push $crossbarContainer:$vCrossbar 
