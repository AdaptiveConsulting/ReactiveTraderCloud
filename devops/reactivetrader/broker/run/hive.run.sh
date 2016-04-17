#! /bin/bash
set -euo pipefail

service="broker"

id="<% cli.id %>"
major="<% reactivetrader.broker.major %>"
minor="<% reactivetrader.broker.minor %>"
image="<% reactivetrader.broker.image %>:${major}.${minor}"
if [[ ${id} != "latest" ]];then image+=".${id}"; fi

docker kill ${service} 2&> /dev/null || true
docker rm ${service} 2&> /dev/null   || true
docker run -d          \
     --net=host        \
     --name ${service} \
     ${image} > /dev/null

echo "${service}"
