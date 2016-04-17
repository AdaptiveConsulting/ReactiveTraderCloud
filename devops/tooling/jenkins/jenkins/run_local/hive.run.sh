#!/bin/bash

docker kill jenkins
docker rm jenkins
docker run -d -p 8000:8080 --name jenkins         \
    -v //var/run/docker.sock:/var/run/docker.sock \
    -v jenkins_home:/var/jenkins_home             \
    tdeheurles/jenkins
