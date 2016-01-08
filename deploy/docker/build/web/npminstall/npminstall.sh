#! /bin/bash

# This script work as a fix to get node cache.
# Sometime, when running npm install inside docker container
#   that share the node_modules with the host, sync error are reported,
#   making the build to fail.
# The idea is to :
#  - copy the client src inside the container,
#  - remove node_modules as the HOST is certainly not the same env
#      as it is inside the container
#  - copy a host `.npm` cache into the container to accelerate the build
#  - copy back the `/root/.npm` cache when the npm install is finished
#  - finally, we get a copy of the dist folder to an host shared folder `/dist`

# fail fast
set -euo pipefail

echo "getting the cache ..."
cp -r /.npm /root/

echo "npm install ..."
cd /client
rm -rf node_modules
npm install
npm run deploy

echo "saving cache ..."
# caching _git-remotes result in an error of copy, I don't cache it
rm -rf /root/.npm/_git-remotes
cp -r /root/.npm /

echo "copying dist ..."
cp -r /client/dist /
