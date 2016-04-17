#! /bin/bash

node_version="<% base.node.official_version %>"

set -euo pipefail

# dependencies for npm install
apt-get update
apt-get install curl build-essential git python -y

# node
# Install manually to easily choose the version
curl -L -O https://nodejs.org/dist/v${node_version}/node-v${node_version}-linux-x64.tar.gz
tar -zxvf node-v${node_version}-linux-x64.tar.gz
rm -r node-v${node_version}-linux-x64.tar.gz
mv node-v${node_version}-linux-x64 /node

# clean
apt-get remove curl -y
apt-get autoremove -y
