#! /bin/bash

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
