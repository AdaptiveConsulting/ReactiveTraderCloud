#!/usr/bin/env bash

rsync -aq ../../../src/client ./

docker build -t weareadaptive/reactive-trader-client .
