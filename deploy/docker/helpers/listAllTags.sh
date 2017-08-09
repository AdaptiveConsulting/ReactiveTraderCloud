#!/bin/bash

# FROM: https://stackoverflow.com/questions/28320134/how-to-list-all-tags-for-a-docker-image-on-a-remote-registry

if [ $# -lt 1 ]
then
cat << HELP

${0}  --  list all tags for a Docker image on a remote registry.

EXAMPLES:
    - list all tags for broker:
       ${0} reactivetrader/broker

    - list all tags for nsgate:
       ${0} weareadaptive/nsgate

NOTES:
    - this helper requires access in PATH to:
        - docker    https://www.docker.com/
        - jq:       https://stedolan.github.io/jq/

HELP
exit
fi

image="$1"
tags=`docker run --rm appropriate/curl -sq https://registry.hub.docker.com/v1/repositories/${image}/tags`
echo "TAGS for ${image}"
echo ${tags} | jq -r ".[].name"
