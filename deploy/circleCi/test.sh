#! /bin/bash

. ../config

echo "Populate test"
result=`docker run --net=host weareadaptive/testtools:1.1 bash -c "curl -H \"Accept: application/json\" http://127.0.1:2113/streams/ccyPair-CADJPY | jq '.streamId == \"ccyPair-CADJPY\"'"`
if ! $result == true;then
  echo "No stream ccyPair-CADJPY found in the eventstore" 
  echo "  populate test has failed" 
  exit 1; 
fi
