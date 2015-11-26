#! /bin/bash

if [[ ! -f ./config/config.sh ]];then
    echo " "
    echo "usage:"
    echo "  you need to copy config.sh from sample.config.sh"
    exit 1
fi

. ./config/config.sh

./gcloud.sh config set project $kube_project
./gcloud.sh config set compute/zone $kube_zone
./gcloud.sh config set container/cluster $kube_cluster
