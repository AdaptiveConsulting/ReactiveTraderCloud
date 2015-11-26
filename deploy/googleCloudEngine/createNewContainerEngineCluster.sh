#! /bin/bash

if [[ ! -f ./config/config.sh ]];then
    echo " "
    echo "usage:"
    echo "  you need to copy config.sh from sample.config.sh"
    exit 1
fi

# load config
. ./config/config.sh

# create cluster
./gcloud.sh container clusters create $kube_cluster             \
                               --zone $kube_zone                \
                               --machine-type $kube_machinetype \
                               --num-nodes $kube_num_nodes
