#! /bin/bash

# install mono
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF || exit 1
echo "deb http://download.mono-project.com/repo/debian wheezy main" \
| sudo tee /etc/apt/sources.list.d/mono-xamarin.list  || exit 1
apt-get update  || exit 1
echo "deb http://download.mono-project.com/repo/debian wheezy-apache24-compat main" \
| sudo tee -a /etc/apt/sources.list.d/mono-xamarin.list  || exit 1
sudo apt-get install -y mono-complete ca-certificates-mono || exit 1

# install dependencies
sudo apt-get install -y unzip                \
                        libunwind8           \
                        libssl-dev           \
                        curl                 \
                        libcurl4-openssl-dev \
                        libcurl3-gnutls      \
  || exit 1

# install DNVM
curl -sSL https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.sh \
| DNX_BRANCH=dev sh  || exit 1
mozroots --import --sync  || exit 1
bash -c "source /root/.dnx/dnvm/dnvm.sh && dnvm upgrade -r mono && dnvm install __VDNX__ -p"  || exit 1

# Clean
apt-get autoremove -y  || exit 1
