#!/bin/bash

set -euo pipefail

if [ ! -v DOCKER_USER ]; then
  echo "Docker registry user must be specifed in DOCKER_USER variable."
  exit 1
fi

if [ ! -v DOCKER_PASS ]; then
  echo "Docker registry password must be specified in DOCKER_PASS variable."
  exit 1
fi

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

    BUILD_VERSION=$version \
    DOCKER_BUILDKIT=1 \
    docker-compose -f ./src/docker-compose.yml build $1

    echo "Pushing \"$1\" (version: $version)"

    BUILD_VERSION=$version \
    docker-compose -f ./src/docker-compose.yml push $1
  fi
}

while IFS= read -r service; do
  name=$(echo $service | awk '{print $1}')
  context=$(echo $service | awk '{print $2}')
  build_service $name $context
done <<< "$services"

