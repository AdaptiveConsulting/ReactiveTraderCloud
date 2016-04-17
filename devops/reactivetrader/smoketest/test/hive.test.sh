#!/bin/bash

major="<% reactivetrader.servers.major %>"
minor="<% reactivetrader.servers.minor %>"
servers_image="<% reactivetrader.servers.image %>:${major}.${minor}"

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
