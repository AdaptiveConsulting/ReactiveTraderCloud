#!/bin/bash

set -euo pipefail

if [ ! -v DEPLOY_ENV ]; then
  echo "Deployment environment must be specified in DEPLOY_ENV variable."
  exit 1
fi

kubectl delete namespace $DEPLOY_ENV
