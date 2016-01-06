#! /bin/sh

set -eu

apt-get update
apt-get install -y curl tar python

curl https://sdk.cloud.google.com | bash

/root/google-cloud-sdk/bin/gcloud components update kubectl
/root/google-cloud-sdk/bin/gcloud components install alpha -q
/root/google-cloud-sdk/bin/gcloud components install beta -q
