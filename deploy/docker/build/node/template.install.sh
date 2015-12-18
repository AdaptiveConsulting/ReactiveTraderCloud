#! /bin/sh

# prerequisite
apt-get update || exit 1
apt-get install curl -y || exit 1

curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash - || exit 1
apt-get update || exit 1
apt-get install -y nodejs build-essential || exit 1

apt-get remove curl -y || exit 1
apt-get autoremove -y || exit 1
