#! /bin/bash

apt-get update && apt-get install -y curl
curl http://download.geteventstore.com/binaries/EventStore-OSS-Ubuntu-v__VEVENTSTORE__.tar.gz | tar xz -C /opt    
  