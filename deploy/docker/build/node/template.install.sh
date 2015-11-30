#! /bin/sh

# prerequisite
apt-get update || exit 1
apt-get install curl -y || exit 1

# node
curl -L -O https://nodejs.org/dist/v__VNODE__/node-v__VNODE__-linux-x64.tar.gz  || exit 1
tar -zxvf node-v__VNODE__-linux-x64.tar.gz || exit 1
rm -r node-v__VNODE__-linux-x64.tar.gz || exit 1
mv node-v__VNODE__-linux-x64 /node  || exit 1
