#! /bin/bash
set -euo pipefail

service="eventstore"

id="<% cli.id %>"
major="<% reactivetrader.eventstore.major %>"
minor="<% reactivetrader.eventstore.minor %>"
image="<% reactivetrader.eventstore.image %>:${major}.${minor}"
if [[ ${id} != "latest" ]];then image+=".${id}"; fi

docker kill ${service} 2&> /dev/null || true
docker rm ${service} 2&> /dev/null   || true
docker run -d          \
     --net=host        \
     --name ${service} \
     ${image} > /dev/null

echo "${service}"
