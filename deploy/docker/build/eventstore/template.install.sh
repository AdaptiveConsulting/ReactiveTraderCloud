#! /bin/bash

apt-get update && apt-get install -y curl
curl http://download.geteventstore.com/binaries/EventStore-OSS-Ubuntu-v3.3.0.tar.gz | tar xz -C /opt    
  