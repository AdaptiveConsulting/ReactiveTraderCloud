#! /bin/bash

if [[ $# != 3 ]];then
    echo " "
    echo "usage:"
    echo " ./initKubectl.sh PROJECT ZONE CLUSTER_NAME"
    echo " ie: ./initKubectl.sh adaptive-trader europe-west1-c cluster"
    exit 1
fi

PROJECT=$1
ZONE=$2
CLUSTER_NAME=$3

./gcloud.sh config set project $PROJECT
./gcloud.sh config set compute/zone $ZONE
./gcloud.sh config set container/cluster $CLUSTER_NAME
./gcloud.sh container clusters get-credentials $CLUSTER_NAME
