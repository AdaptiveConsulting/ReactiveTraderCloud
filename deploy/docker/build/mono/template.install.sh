#! /bin/bash

set -euo pipefail

# install mono
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb http://download.mono-project.com/repo/debian wheezy main" \
| sudo tee /etc/apt/sources.list.d/mono-xamarin.list
apt-get update
echo "deb http://download.mono-project.com/repo/debian wheezy-apache24-compat main" \
| sudo tee -a /etc/apt/sources.list.d/mono-xamarin.list
sudo apt-get install -y mono-complete ca-certificates-mono

# install dotnet cli
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893
sudo apt-get -y install apt-transport-https
sudo apt-get update
sudo apt-get -y install __DOTNET_VERSION__

# Clean
apt-get autoremove -y
