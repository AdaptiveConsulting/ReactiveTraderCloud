#!/bin/bash

if  [ "${1}" == "" ] ||
    [ "${2}" == "" ] ||
    [ "${3}" == "" ]
then
    echo -e ""
    echo -e "\e[31mBad usage, please try:\e[39m\n${0} <NAMESPACE> <SERVICE> <BUILD_NUMBER>"
    echo -e "\n\e[32mExample:\e[39m\n${0} dev web test1245"
    exit 1
fi

namespace="${1}"
service="${2}"
build_number="${3}"
deploy_folder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."

cd ${deploy_folder}/docker &&
./prepare build ${service} ${build_number} &&
./prepare push ${service} ${build_number} &&
cd ${deploy_folder}/kubernetes/templates &&
./generate_rc_manifest ${service} ${namespace} ${build_number} &&
cd ${deploy_folder}/kubernetes &&
./kubectl delete rc ${service} --namespace ${namespace} &&
./kubectl create -f manifests/${service}-rc.yml
