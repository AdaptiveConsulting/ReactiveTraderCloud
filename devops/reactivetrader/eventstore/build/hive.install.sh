#! /bin/bash

eventstore_version="<% base.eventstore.official_version %>"

apt-get update && apt-get install -y curl
curl http://download.geteventstore.com/binaries/EventStore-OSS-Ubuntu-v${eventstore_version}.tar.gz \
| tar xz -C /opt
