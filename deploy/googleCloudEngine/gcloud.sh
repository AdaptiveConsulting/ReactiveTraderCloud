#! /bin/bash

docker run --rm -ti                       \
  -v /$(pwd)/cache/.config://root/.config \
  -v /$(pwd)/cache/.kube://root/.kube     \
  weareadaptive/gcloud gcloud $@
