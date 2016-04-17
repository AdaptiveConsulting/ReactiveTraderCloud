#! /bin/bash
set -euo pipefail

service="web"

id="<% cli.id %>"
major="<% reactivetrader.web.major %>"
minor="<% reactivetrader.web.minor %>"
image="<% reactivetrader.web.image %>:${major}.${minor}"
if [[ ${id} != "latest" ]];then image+=".${id}"; fi


docker kill ${service} 2&> /dev/null || true
docker rm ${service} 2&> /dev/null   || true

command="cp /localhost/nginx.conf /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
docker run -d           \
     --net=host         \
     --name ${service}  \
     ${image}           \
     bash -c "$command" > /dev/null

echo "${service}"
