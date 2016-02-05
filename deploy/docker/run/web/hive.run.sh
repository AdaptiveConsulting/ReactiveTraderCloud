#! /bin/bash

build="<% args.build %>"
service="<% args.service %>"
image="<% container.reactivetrader.web %>.${build}"

# fail fast
set -euo pipefail

echo ${service}

docker rm ${service} 2&> /dev/null || true

command="cp /localhost/nginx.conf /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
docker run -d           \
     --net=host         \
     --name ${service}  \
     ${image}           \
     bash -c "$command" \
     > ${service}_id 

echo " "
