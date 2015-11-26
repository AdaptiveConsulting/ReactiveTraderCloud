#! /bin/bash

if [[ ! -f ./config/config.sh ]];then
    echo " "
    echo "usage:"
    echo "  you need to copy config.sh from sample.config.sh"
    exit 1
fi

if [[ $1 != "-y" ]];then
    echo " "
    echo "usage:"
    echo "  you need to confirm deletion by adding -y"
    echo "  ie: ./deleteCluster.sh -y"
    exit 1
fi

. ./config/config.sh
./gcloud.sh container clusters delete --quiet $kube_cluster 
