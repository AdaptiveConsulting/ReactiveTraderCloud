#! /bin/bash

build="<% args.build %>"
configuration="<% args.configuration %>"
service="<% args.service%>"
image="<% container.reactivetrader.servers %>"

analytics_command="a"
blotter_command="b"
pricing_command="p"
referencedataread_command="ref"
tradeexecution_command="exec"

launcher_command="${<% args.service %>_command}"


#fail fast
set euo -pipefail

if [[ ${configuration} != "release" ]];then
  configuration=""
fi

echo "${service}"

start_command="dnx ${configuration} -p Adaptive.ReactiveTrader.Server.Launcher run ${launcher_command}"
wait_command="while true; do echo ping; sleep 60; done"
command="${start_command} && ${wait_command}"

docker rm ${service} 2&> /dev/null || true

docker run -d             \
     --net=host           \
     --name ${service}    \
     ${image}             \
     bash -c "${command}" \
     > ${service}_id

echo " "
