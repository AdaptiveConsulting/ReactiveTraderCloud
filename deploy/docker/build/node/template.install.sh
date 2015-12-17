#! /bin/sh

set -eu

# prerequisite
apt-get update
apt-get install curl -y

# node
curl -L -O https://nodejs.org/dist/v__VNODE__/node-v__VNODE__-linux-x64.tar.gz
tar -zxvf node-v__VNODE__-linux-x64.tar.gz
rm -r node-v__VNODE__-linux-x64.tar.gz
mv node-v__VNODE__-linux-x64 /node

# python
apt-get install python -y
