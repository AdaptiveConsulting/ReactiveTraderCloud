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

# install dependencies
sudo apt-get install -y unzip                \
                        libunwind8           \
                        libssl-dev           \
                        curl                 \
                        libcurl4-openssl-dev \
                        libcurl3-gnutls

# install DNVM
curl -sSL https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.sh \
| DNX_BRANCH=dev sh
mozroots --import --sync
bash -c "source /root/.dnx/dnvm/dnvm.sh && dnvm upgrade -r mono && dnvm install __VDNX__ -p"

# Clean
apt-get autoremove -y
