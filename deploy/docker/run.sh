#!/bin/bash

if [[ $# -le 1 ]];then
  echo "usage:"
  echo " $0 SERVICE BUILD [CONFIGURATION=(Dev|Release)]"
  exit 1
fi
service=$1
build=$2
configuration=$3

if [[ ${configuration} != "Release" ]];then
  configuration="Dev"
fi

# fail fast
set -euo pipefail

if [[ ${service} == "analytics"
   || ${service} == "blotter"
   || ${service} == "pricing"
   || ${service} == "referencedataread"
   || ${service} == "tradeexecution"
]];then
  folder="servers"
else
  folder="${service}"
fi
if [[ ! -e run/${folder} ]];then
  echo "no service ${service} found"
  exit 1
fi


cd ../..
./hive script hive_run                 \
    --config deploy/config.yml         \
    deploy/docker/run/${folder} run.sh \
    configuration ${configuration}     \
    service ${service}                 \
    build ${build}
    
