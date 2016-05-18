#! /bin/bash

if [[ $1 == "" ]];then
  echo "The id is required for this step"
  exit 1
fi
id=$1

# fail fast
set -euo pipefail

cd ../..
# this variables need to be exported or added to the CI
./hive docker cli login -e ${DOCKER_EMAIL} -u ${DOCKER_USER} -p ${DOCKER_PASS}

push_command="./prepare.sh push services ${id}"
cd deploy/docker

${push_command}

if [[ $? != 0 ]];then
  echo "Push have failed, retrying ..."
  sleep 5
  ${push_command}
fi
