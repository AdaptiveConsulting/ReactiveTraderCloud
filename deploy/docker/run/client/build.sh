#!/usr/bin/env bash

rsync -aq ../../../../src/client ./

docker build --no-cache -t weareadaptive/reactive-trader-client .
