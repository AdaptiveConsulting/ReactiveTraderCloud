#! /bin/bash
set euo -pipefail

major="<% reactivetrader.servers.major %>"
minor="<% reactivetrader.servers.minor %>"
image="<% reactivetrader.servers.image %>:${major}.${minor}"

cd ../../common
./execute_server_service.sh                 \
  -id="<% cli.id %>"                        \
  -image=${image}                           \
  -configuration="<% cli.configuration %>" \
  -service="blotter"                        \
  -key="b"
