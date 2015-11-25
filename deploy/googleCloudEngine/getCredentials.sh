#! /bin/bash

if [[ ! -f ./config/config.sh ]];then
    echo " "
    echo "usage:"
    echo "  you need to copy config.sh from sample.config.sh and fill informations"
    exit 1
fi

. ./config/config.sh

./gcloud.sh container clusters get-credentials $kube_cluster
