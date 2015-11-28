#!/usr/bin/env bash

rsync -aq --exclude 'node_modules' ../../../../src/client ./

docker build --no-cache -t weareadaptive/at-web .
