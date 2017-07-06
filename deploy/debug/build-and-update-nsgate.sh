#!/bin/bash

if [ "${1}" == "" ]
then
    echo -e ""
    echo -e "\e[31mBad usage, please try:\e[39m\n${0} <BUILD_ID>"
    echo -e "\n\e[32mExample:\e[39m\n${0} test1245"
    exit 1
fi

build_number="${1}"
deploy_folder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
service="nsgate"

cd ${deploy_folder}/docker &&
./prepare build ${service} ${build_number} &&
./prepare push ${service} ${build_number} &&
cd ${deploy_folder}/kubernetes &&
./replaceNsGate ${build_number}
