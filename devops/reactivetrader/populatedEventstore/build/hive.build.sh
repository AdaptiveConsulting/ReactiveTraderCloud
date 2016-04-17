#!/usr/bin/env bash

id="<% cli.id %>"
major="<% base.eventstore.major %>"
minor="<% base.eventstore.minor %>"
base_eventstore_image="<% base.eventstore.image %>:${major}.${minor}"

major="<% reactivetrader.servers.major %>"
minor="<% reactivetrader.servers.minor %>"
reactivetrader_servers_image="<% reactivetrader.servers.image %>:${major}.${minor}"

major="<% reactivetrader.eventstore.major %>"
minor="<% reactivetrader.eventstore.minor %>"
reactivetrader_eventstore_image="<% reactivetrader.eventstore.image %>:${major}.${minor}"

temp_container="eventstore_populate"

# fail fast
set -euo pipefail

# run eventstore
docker rm ${temp_container} 2&> /dev/null || true
docker run -d --net=host   \
  --name ${temp_container} \
  ${base_eventstore_image}

# populate it
populateCommand=`cat "../../../../src/server/Populate Event Store.bat"`
docker run --net=host                   \
     ${reactivetrader_servers_image}.${id} \
     ${populateCommand}

# commit container
docker commit ${temp_container} ${reactivetrader_eventstore_image}
docker tag ${reactivetrader_eventstore_image} ${reactivetrader_eventstore_image}.${id}

# clean up
docker kill ${temp_container}
docker rm ${temp_container}
