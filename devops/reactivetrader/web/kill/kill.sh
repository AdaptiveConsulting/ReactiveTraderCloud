#!/bin/bash

service="web"
docker kill ${service} || true
docker rm   ${service} 2&> /dev/null  || true
