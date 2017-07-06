#!/usr/bin/env bash

build=$1
if [[ $build = "" ]];then
  echo "servers-build: build number required as first parameter"
  exit 1
fi

# fail fast
set -euo pipefail

# load configuration
this_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
root_directory="${this_directory}/../../../.."
. ${root_directory}/deploy/config

# get source code
mkdir -p ${this_directory}/build
cp -r ${root_directory}/src/server ${this_directory}/build/
cp ${this_directory}template.Dockerfile ${this_directory}build/Dockerfile
sed -ie "s|__DOTNET_CONTAINER__|$dotnetContainer|g" ${this_directory}build/Dockerfile

# build
docker build --no-cache -t weareadaptive/serverssrc:$build ${this_directory}build/.

# restore package
container_name="dotnetrestored"
if [[ "$(docker ps -q -a --filter name=${container_name})" != "" ]]
then docker rm ${container_name} > /dev/null
fi

build_command="mkdir -p /packages"
build_command="${build_command} && dotnet restore"
build_command="${build_command} && dotnet build */project.json --configuration Release"
docker run -t --name ${container_name} -v /$(pwd)/dotnetcache:/packages weareadaptive/serverssrc:$build bash -c "${build_command}"

# commit
docker commit ${container_name} $serversContainer
docker tag $serversContainer $serversContainer.$build

# clean
if [[ "$(docker ps -q -a --filter name=${container_name})" != "" ]]
then docker rm ${container_name} > /dev/null
fi
