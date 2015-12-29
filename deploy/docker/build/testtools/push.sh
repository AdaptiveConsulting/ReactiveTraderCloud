#! /bin/bash

# fail fast
set -euo pipefail

. ../../../config

# push
docker push $testtoolsContainer:$vTesttools
docker push $testtoolsContainer:latest
