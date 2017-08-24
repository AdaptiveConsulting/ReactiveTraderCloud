#!/bin/bash
function showClusters {
    echo " - cluster:  where we do service level update. demo/dev/... environments are in this cluster. Present on gcloud"
    echo " - dev:      where we do infrastructure updates. Only Devops and Admin should use this cluster. Present on gcloud"
}
