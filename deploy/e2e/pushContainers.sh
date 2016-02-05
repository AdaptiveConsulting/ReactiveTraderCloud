#! /bin/bash

if [[ $1 == "" ]];then
  echo "The build number is required for this step"
  exit 1
fi
build=$1

# fail fast
set -euo pipefail

#./hive docker cli login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS
cd ../..
./hive docker cli login -e tdeheurles@gmail.com -u tdeheurles -p leader051105

push_command="./prepare.sh push services ${build}"
cd deploy/docker

${push_command}

if [[ $? != 0 ]];then
  echo "Push have failed, retrying ..."
  sleep 5
  ${push_command}
fi
