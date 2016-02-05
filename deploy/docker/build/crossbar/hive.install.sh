#! /bin/bash

# fail fast
set -euo pipefail

# crossbar
apt-key adv --keyserver hkps.pool.sks-keyservers.net --recv D58C6920
sh -c "echo 'deb http://package.crossbar.io/ubuntu trusty main' \
    > /etc/apt/sources.list.d/crossbar.list"

apt-get update
apt-get install crossbar -y
