#!/bin/bash
set -euo pipefail

usage() {
    echo "usage:"
    echo " $0 -id= -image= -configuration= -service= -key="
}

for i in "${@}"; do
  case ${i} in
    -id=*)            id="${i#*=}";            shift ;;
    -image=*)         image="${i#*=}";         shift ;;
    -configuration=*) configuration="${i#*=}"; shift ;;
    -service=*)       service="${i#*=}";       shift ;;
    -key=*)           key="${i#*=}";           shift ;;
    *) ARGS="$@";                              shift ;;
    -*) echo "unknown option: $1" >&2; usage;  exit 1;;
  esac
done

if [[ ${id} != "latest" ]];then image+=".${id}"; fi

if [[ ${configuration} == "release" ]];then
  configuration="--configuration Release"
elif [[ ${configuration} == "dev" ]];then
  configuration=""
else
  echo "${service}: configuration: ${configuration} is not recognised."
  echo "choose between release|dev"
  exit 1
fi

command="dnx ${configuration}"
command+=" -p Adaptive.ReactiveTrader.Server.Launcher run ${key}"
command+=" && while true; do echo ping; sleep 60; done"

docker kill ${service} 2&> /dev/null || true
docker rm   ${service} 2&> /dev/null || true
docker run -d             \
     --net=host           \
     --name ${service}    \
     ${image}             \
     bash -c "${command}" > /dev/null

echo "${service}"
