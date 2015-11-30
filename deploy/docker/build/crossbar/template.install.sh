#! /bin/bash

# crossbar
apt-key adv --keyserver hkps.pool.sks-keyservers.net --recv D58C6920 || exit 1
sh -c "echo 'deb http://package.crossbar.io/ubuntu trusty main' \
    > /etc/apt/sources.list.d/crossbar.list" || exit 1

apt-get update || exit 1
apt-get install crossbar -y || exit 1
