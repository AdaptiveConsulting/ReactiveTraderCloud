#!/bin/bash

service=$1
if [[ ${service} == "" ]];then
    echo "usage:"
    echo " $0 SERVICE"
fi

# fail fast
set -euo pipefail

if [[ 
       ${service} == "analytics"
    || ${service} == "blotter"
    || ${service} == "pricing"
    || ${service} == "referencedataread"
    || ${service} == "tradeexecution"
]];then
  folder="servers"
else
  folder="${service}"
fi

container=${service}_id

cd run/${folder}
if [[ -f ${container} ]];then
  docker kill `cat ${container}`
  rm ${container}
fi
cd ../..
