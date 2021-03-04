#!/bin/bash

set -euo pipefail

export DOCKER_USER=reactivetradercloud
export DEPLOY_ENV=${1:-}

if [ -z $DEPLOY_ENV ]; then
  echo "No environment name specified."
  echo "Usage: build-and-deploy.sh [environment]"
  exit 1
fi

if [ ! -v DOCKER_PASS ]; then
  echo "Docker registry password must be specified in DOCKER_PASS variable."
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

# TODO: parse docker-compose manifest for these values
services=$(cat <<-END
broker       ./src/services/broker
servers      ./src/server
pricehistory ./src/server/node
nlp          ./src/server/node
bot          ./src/server/node/bot
client       ./src/client
new-client   ./src/new-client
END
)

build_version () {
  local version=$(git ls-tree HEAD -- $1 | awk '{print $3}')
  echo $version
}

tag_exists () {
  curl --silent -f -lL https://hub.docker.com/v2/repositories/$1/tags/$2 > /dev/null
}

build_service () {
  local version=$(build_version $2)

  if ! tag_exists $DOCKER_USER/$1 $version; then
    echo "Building \"$1\" (version: $version)"

    ENVIRONMENT_NAME=$DEPLOY_ENV \
    BUILD_VERSION=$version \
    DOCKER_BUILDKIT=1 \
    docker-compose -f ./src/docker-compose.yml build $1

    echo "Pushing \"$1\" (version: $version)"

    BUILD_VERSION=$version \
    docker-compose -f ./src/docker-compose.yml push $1
  fi
}

before_build () {
  echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
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

before_build

while IFS= read -r service; do
  name=$(echo $service | awk '{print $1}')
  context=$(echo $service | awk '{print $2}')
  build_service $name $context
done <<< "$services"

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
