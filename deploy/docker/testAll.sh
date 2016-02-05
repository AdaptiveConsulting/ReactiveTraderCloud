#! /bin/bash

# fail fast
set -euo pipefail

cd ../..

for test in "eventstore" "servers" 
do
    ./hive script hive_run          \
        --config deploy/config.yml  \
        deploy/docker/run/tests ${test}.sh
done
