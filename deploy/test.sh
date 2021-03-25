#!/bin/bash

set -euo pipefail

if [ ! -v DOCKER_USER ]; then
  echo "Docker registry user must be specified in DOCKER_USER variable."
  exit 1
fi

build_version () {
  if [ -v TAG ]; then
    echo $TAG
  else
    git ls-tree HEAD -- $1 | awk '{print $3 }'
  fi
}

images=$(cat <<-END
eventstore/eventstore release-5.0.9
$DOCKER_USER/broker   $(build_version ./src/services/broker)
$DOCKER_USER/servers  $(build_version ./src/server)
END
)

local_tag_exists () {
  docker image inspect $1:$2 > /dev/null 2>&1
}

remote_tag_exists () {
  curl --silent -f -lL https://hub.docker.com/v2/repositories/$1/tags/$2 > /dev/null
}

pull_image_if_not_exists () {
  if ! local_tag_exists $1 $2; then
    if ! remote_tag_exists $1 $2; then
      echo "Cannot find image for '$1' tagged with '$2'."
      exit 1
    fi

    docker pull $1:$2
  fi
}

tag_image () {
  docker tag $1:$2 $1:test-build
}

run_integration_tests () {
  BUILD_VERSION=test-build \
  docker-compose -f ./src/docker-compose.yml -f ./src/docker-compose.test.yml run integration
  
  BUILD_VERSION=test-build \
  docker-compose -f ./src/docker-compose.yml -f ./src/docker-compose.test.yml rm -s -f
}

while IFS= read -r image; do
  name=$(echo $image | awk '{print $1}')
  version=$(echo $image | awk '{print $2}')
  pull_image_if_not_exists $name $version
  tag_image $name $version
done < <(echo "$images")

run_integration_tests
