#! /bin/bash

for server in "referencedataread" "pricing" "tradeexecution" "blotter" "analytics" "broker" "eventstore" "web"
do
    ./kill.sh ${server}
done
