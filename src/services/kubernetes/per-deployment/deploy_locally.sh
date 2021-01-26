#!/bin/bash

export DOCKER_USER='localhost:32000'
export BUILD_VERSION='0.0.0'
export DEPLOY_ENV='reactive-trader-local'
cd ../..
docker-compose build
docker-compose push

# This is how we deploy from GitHub
#microk8s kubectl scale deploy --replicas=0 --all -n ${DEPLOY_ENV}

# In this way I can start from scratch and seed the data each time
microk8s kubectl delete --all ingress -n ${DEPLOY_ENV}
microk8s kubectl delete --all deployments -n ${DEPLOY_ENV}
microk8s kubectl delete --all jobs -n ${DEPLOY_ENV}

# Removing the services will change the IP adresses
#microk8s kubectl delete --all services -n ${DEPLOY_ENV}

for f in $(find ./services/kubernetes/per-deployment -type f -name "*.yaml"); do cat $f | /usr/bin/envsubst | microk8s kubectl apply -n ${DEPLOY_ENV} -f -; done
