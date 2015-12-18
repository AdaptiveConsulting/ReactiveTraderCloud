#! /bin/bash

set -euo pipefail

. ../../../config

docker push $gcloudContainer:$vGcloud
docker push $gcloudContainer:latest
