#! /bin/bash

# fail fast
set -euo pipefail

. ../config

mkdir -p save/docker
mkdir -p save/packages

echo "Saving containers"
# docker save $monoContainer        > save/docker/mono.tar
# docker save $crossbarContainer    > save/docker/crossbar.tar
# docker save $eventstoreContainer  > save/docker/eventstore.tar
# docker save $nginxContainer       > save/docker/nginx.tar
# docker save $nodeContainer        > save/docker/node.tar

saveCommand="tar cvf /tmp/backup.tar /data"
for container in "${dnupackageContainer}" "${nodemodulesContainer}" "${npmCacheContainer}" 
do
    echo ${container}
    
    docker rm ${container} || true
    docker run -t         \
    --name ${container}   \
    -v ${container}:/data \
    ${ubuntuContainer}    \
    bash -c "$saveCommand"

    docker cp ${container}:/tmp/backup.tar \
              save/packages/${container}.tar
            
    docker rm ${container}
done
