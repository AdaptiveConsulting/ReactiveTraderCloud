#! /bin/bash

if [[ $1 == "-h" ]];then
  echo "usage:"
  echo " $0 [BUILD] [CONFIGURATION=(Dev|Release)]"
  exit 0
fi
build=$1
configuration=$2

# fail fast
#set -euo pipefail

if [[ ${configuration} != "Release" ]];then
  configuration="Dev"
fi

for service in "web" "eventstore" "broker" "referencedataread" "pricing" "tradeexecution" "blotter" "analytics"
do
    command="./run.sh ${service} ${build} ${configuration}"
    
    ${command}
    if [[ $? != 0 ]];then
      sleep 5
      ${command}
    fi
done
