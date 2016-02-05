#!/usr/bin/env bash

build="<% args.build %>"
base_eventstore="<% container.base.eventstore %>"
reactivetrader_eventstore="<% container.reactivetrader.eventstore %>"
reactivetrader_servers="<% container.reactivetrader.servers %>"

# fail fast
set -euo pipefail

# run eventstore
docker run -d --net=host ${base_eventstore} > eventstore_id

# populate it
populateCommand=`cat "../../../../src/server/Populate Event Store.bat"`
docker run -t --net=host                \
     ${reactivetrader_servers}.${build} \
     ${populateCommand}

# commit container
docker commit `cat eventstore_id` ${reactivetrader_eventstore}
docker tag ${reactivetrader_eventstore} ${reactivetrader_eventstore}.${build}

# clean up
docker kill `cat eventstore_id`
rm eventstore_id
