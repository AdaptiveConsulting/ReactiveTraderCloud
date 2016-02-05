#! /bin/bash

testtools_image="<% container.tooling.testtools %>"

# fail fast
set euo -pipefail

# Test eventstore
test_command="for i in {1..10}; do curl -S http://localhost:2113/web/index.html && break; sleep 1; if [[ \$i == 10 ]];then false;fi; done"
docker run -t        \
  --net=host         \
  ${testtools_image} \
  bash -c "${test_command}"

if [[ $? != 0 ]];then
  echo "Eventstore test as fail"
  exit 1
fi
