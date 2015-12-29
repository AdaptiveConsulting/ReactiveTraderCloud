#! /bin/bash

## from http://docs.fluentd.org/articles/install-by-deb

### Before Installation
cat <<EOF >> /etc/sysctl.conf

net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 10240    65535
EOF

### Before Installation

apt-get update
apt-get install curl -y
curl -L https://toolbelt.treasuredata.com/sh/install-ubuntu-trusty-td-agent2.sh | sh
