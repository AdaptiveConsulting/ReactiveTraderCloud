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

# get the cache
cp -r /.npm /root/

# get/update dependencies
cd /client
rm -rf node_modules
npm install
npm run compile 

# save the dependencies
cp -r /root/.npm /

# give the dist folder
cp -r /client/dist /
