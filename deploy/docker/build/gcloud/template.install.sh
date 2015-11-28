#! /bin/sh

apt-get update
apt-get install -y curl tar python

curl https://sdk.cloud.google.com | bash

/root/google-cloud-sdk/bin/gcloud components update kubectl
