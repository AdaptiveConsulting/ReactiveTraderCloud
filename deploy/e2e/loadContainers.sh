#! /bin/bash

circleci=${CI}

# fail fast
set -euo pipefail

# echo "Loading containers"

# for container in "mono" "crossbar" "eventstore" "nginx" "dnupackage" "nodemodules"
# do
#   if [[ -e ~/docker/$container.tar ]]; then 
#     docker load -i ~/docker/$container.tar && echo "$container loaded" 
#   fi
# done

. ../config

for container in "${dnupackageContainer}" "${nodemodulesContainer}" "${npmCacheContainer}"
do
    if [[ -e save/packages/${container}.tar ]];then
        # start container
        docker rm ${container} || true
        docker run -d                 \
            --name ${container}       \
            -v ${container}:/packages \
            ${ubuntuContainer}        \
            bash -c "while true; do echo ping; sleep 60; done"
        
        # copy tar in it
        docker cp save/packages/${container}.tar \
          ${container}:/tmp/data.tar
        
        # untar
        untarCommand="cd /tmp && tar xvf /tmp/data.tar  && cp -r data/* /packages"
        if [[ ${circleci} == true ]];then
            echo "circleci detected"
            sudo lxc-attach -n "$(docker inspect --format '{{.Id}}' ${container})" -- bash -c "${untarCommand}"
        else
            docker exec -t ${container} bash -c "${untarCommand}"
        fi
        
        # stop and clean
        docker stop ${container}
        docker rm ${container}
    fi
done
