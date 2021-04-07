#!/bin/bash

set -euo pipefail

if [ ! -v DOCKER_USER ]; then
  echo "Docker registry user must be specifed in DOCKER_USER variable."
  exit 1
fi

# TODO: parse docker-compose manifest for these values
images=$(cat <<-END
broker       ./src/services/broker
servers      ./src/server
pricehistory ./src/server/node
nlp          ./src/server/node
bot          ./src/server/node/bot
client       ./src/client
storybook    ./src/client
styleguide   ./src/client
new-client   ./src/new-client
END
)

build_version () {
  if [ -v TAG ]; then
    echo $TAG
  else
    git ls-tree HEAD -- $1 | awk '{print $3}'
  fi
}

remote_tag_exists () {
  curl --silent -f -lL https://hub.docker.com/v2/repositories/$1/tags/$2 > /dev/null
}

build_image () {
  local version=$(build_version $2)

  if [ -v TAG ] || ! remote_tag_exists $DOCKER_USER/$1 $version; then
    echo "Building \"$1\" (version: $version)"

    BUILD_VERSION=$version \
    DOCKER_BUILDKIT=1 \
    docker-compose -f ./src/docker-compose.yml build $1
  fi
}

while IFS= read -r image; do
  name=$(echo $image | awk '{print $1}')
  context=$(echo $image | awk '{print $2}')
  build_image $name $context
done < <(echo "$images")

