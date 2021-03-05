#!/bin/bash

set -euo pipefail

if [ ! -v DOCKER_USER ]; then
  echo "Docker registry user must be specifed in DOCKER_USER variable."
  exit 1
fi

if [ ! -v DEPLOY_ENV ]; then
  echo "Deployment environment must be specified in DEPLOY_ENV variable."
  exit 1
fi

if [ ! -v GKE_CLUSTER ]; then
  echo "Deployment cluster must be specified in GKE_CLUSTER variable."
  exit 1
fi

if [ ! -v GCP_COMPUTE_ZONE ]; then
  echo "GCP compute zone must be specified in GCP_COMPUTE_ZONE variable."
  exit 1
fi

echo "Preparing deployment to \"$DEPLOY_ENV\""

kuberoot="./src/services/kubernetes/per-deployment"

build_version () {
  local version=$(git ls-tree HEAD -- $1 | awk '{print $3}')
  echo $version
}

deploy_service () {
  local version=${2:+$(build_version $2)}

  echo "Deploying \"$1\" (version: $version)"

  cat $kuberoot/$1.yaml \
    | BUILD_VERSION=$version envsubst '${DEPLOY_ENV},${DOCKER_USER},${BUILD_VERSION}' \
    | kubectl apply --namespace $DEPLOY_ENV -f -
}

deploy_dotnet_service () {
  deploy_service $1 ./src/server
}

before_deploy () {
  gcloud container clusters get-credentials $GKE_CLUSTER --zone $GCP_COMPUTE_ZONE

  # Create environment namespace if not exists
  kubectl create namespace $DEPLOY_ENV --dry-run=client -o yaml | kubectl apply -f -
  
  # Downscale existing deployment
  for deployment in $(kubectl get deployments --no-headers --ignore-not-found=true -o name --namespace $DEPLOY_ENV); do
    kubectl scale --replicas=0 --namespace $DEPLOY_ENV $deployment
  done

  # Delete batch jobs
  kubectl delete jobs --all --namespace $DEPLOY_ENV

  # Delete persistent volumes
  kubectl delete persistentvolumeclaims --all --namespace $DEPLOY_ENV
}

after_deploy () {
  # Wait for eventstore deployment to be ready
  kubectl rollout status deployment eventstore-deployment --namespace $DEPLOY_ENV

  # Run initialisation batch job
  deploy_dotnet_service seed
}

before_deploy

deploy_service eventstore
deploy_service broker ./src/services/broker

deploy_dotnet_service analytics
deploy_dotnet_service blotter
deploy_dotnet_service pricing
deploy_dotnet_service referencedataread
deploy_dotnet_service tradeexecution

deploy_service nlp ./src/server/node
deploy_service pricehistory ./src/server/node
deploy_service bot ./src/server/node/bot

deploy_service client ./src/client
deploy_service new-client ./src/new-client

after_deploy
