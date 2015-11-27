#! /bin/bash

cacheFolder=$(pwd)/../cache

docker run --rm -ti                       \
  -v /$cacheFolder/.config://root/.config \
  -v /$cacheFolder/.kube://root/.kube     \
  weareadaptive/gcloud gcloud $@
