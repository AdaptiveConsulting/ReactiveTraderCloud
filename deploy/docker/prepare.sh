#! /bin/bash

# fail fast
set -euo pipefail

# CONFIGURATION
# =============
possibleCommands="build push"
services="servers broker web populatedEventstore"
possibleGroup="services gcloud mono nginx node testtools crossbar eventstore nsgate jenkins $services"

# USAGE
# =====
listcontains() {
  for word in $1; do
    [[ ${word} = $2 ]] && return 0
  done
  return 1
}

usage() {
    echo " "
    echo " usage:"
    echo "   prepare COMMAND GROUP BUILD_ID"
    echo " "
    echo " COMMAND can be:"
    echo "   $possibleCommands"
    echo " "
    echo " GROUP can be:"
    echo "   $possibleGroup"
    echo "   use services as [$services]"
    echo " "
    echo " BUILD_ID can be:"
    echo "   - a string"
    echo "   - a number"
    echo " "
    echo " ie: prepare build services 125"
    echo "     prepare build mono localtest"
    echo "     prepare push node 178"
    echo " "
}

if [[ $# != 3 ]];then
  usage
  exit 1
fi
command=$1
group=$2
build=$3

# control build/push
if ! listcontains "${possibleCommands}" ${command}; then 
    echo "command ${command} is not recognised"
    echo "possible commands are ${possibleCommands}"
    exit 1
fi 

# control services/crossbar/eventstore ...
if ! listcontains "${possibleGroup}" ${group}; then 
    echo "group ${group} is not recognised"
    echo "possible groups are ${possibleGroup}"
    exit 1
fi

# define services
if [[ ${group} = "services" ]];then
    group=${services}
fi

# BUILD
# =====
if [[ ${command} = "build" ]];then
  cd ../..
  for service in ${group}
  do
    echo "======================"
    echo "= Build ${service}"
    echo "======================"
    ./hive script hive_run             \
        --config deploy/config.yml     \
        deploy/docker/build/${service} \
        build.sh                       \
        build ${build}
  done
  exit 0
fi


# PUSH
# ====
if [[ ${command} = "push" ]];then
  cd ../..
  for service in ${group}
  do
    echo "======================"
    echo "= Push ${service}"
    echo "======================"
    ./hive script hive_run             \
        --config deploy/config.yml     \
        deploy/docker/build/${service} \
        push.sh                        \
        build ${build}
  done
  exit 0
fi
