#!/usr/bin/env bash

if [[ $1 == "" ]];then
  echo "usage:"
  echo "  $0 BUILD"
  echo " "
  exit 1
fi
build=$1

# fail fast
set -euo pipefail

# get and control config
. ../../../config

docker push $nsGateContainer:$vNsGateMajor.$vNsGateMinor.$build
