#!/bin/bash

export DOCKER_USER='localhost:32000'
export BUILD_VERSION='0.0.0'
cd ../..
docker-compose build
docker-compose push

# This is how we deploy from GitHub
#microk8s kubectl scale deploy --replicas=0 --all -n reactive-trader-local

# In this way I can start from scratch and seed the data each time
microk8s kubectl delete --all deployments -n reactive-trader-local
microk8s kubectl delete --all jobs -n reactive-trader-local

# Removing the services will change the IP adresses 
#microk8s kubectl delete --all services -n reactive-trader-local

for f in $(find ./services/kubernetes -type f -name "*.yaml"); do cat $f | /usr/bin/envsubst | microk8s kubectl apply -n reactive-trader-local -f -; done
