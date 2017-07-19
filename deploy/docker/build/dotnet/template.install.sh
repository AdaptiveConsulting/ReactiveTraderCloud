#! /bin/bash

set -euo pipefail

# install dotnet cli
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893
sudo apt-get -y install apt-transport-https
sudo apt-get update
sudo apt-get -y install __DOTNET_VERSION__

# Clean
apt-get autoremove -y

# Pre-populate packages
cd ~ && mkdir init && cd init
dotnet new
dotnet restore
cd ~ && rm -rf init
