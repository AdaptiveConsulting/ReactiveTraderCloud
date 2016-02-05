#! /bin/bash

build="<% args.build %>"
service="<% args.service %>"
image="<% container.reactivetrader.eventstore %>.${build}"

# fail fast
set -euo pipefail

echo ${service}

docker rm ${service} 2&> /dev/null || true

docker run -d          \
     --net=host        \
     --name ${service} \
     ${image}          \
     > ${service}_id 

echo " "
