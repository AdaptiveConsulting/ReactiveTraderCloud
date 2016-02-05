#!/bin/bash

servers_image="<% container.reactivetrader.servers %>"

# fail fast
set -euo pipefail

# smoke tests
echo " "
echo "Starting local tests ..."
test_command="dnx --configuration Release -p Adaptive.ReactiveTrader.Server.IntegrationTests test -parallel none"
docker run         \
  --net=host       \
  ${servers_image} \
  bash -c "${test_command}"
