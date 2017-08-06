#!/bin/bash

if [ "${1}" == "" ]
then
    echo -e ""
    echo -e "\e[31mBad usage, please try:\e[39m\n${0} <BUILD_ID>"
    echo -e "\n\e[32mExample:\e[39m\n${0} test1245"
    exit 1
fi

build_number="${1}"
root_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
prepare="${root_directory}/deploy/docker/prepare"
replaceNsGate="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../kubernetes/replaceNsGate"
service="nsgate"

${prepare} build ${service} ${build_number} &&
${prepare} push ${service} ${build_number} &&
${replaceNsGate} ${build_number}
