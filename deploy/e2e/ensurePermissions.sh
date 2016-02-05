#! /bin/bash

# fail fast
set -euo pipefail

chmod 755 ../docker/prepare.sh
chmod 755 ../docker/build/servers/hive.build.sh
chmod 755 ../docker/build/broker/hive.build.sh
chmod 755 ../docker/build/populatedEventstore/hive.build.sh
chmod 755 ../docker/build/web/hive.build.sh
chmod 755 ../docker/build/servers/hive.push.sh
chmod 755 ../docker/build/broker/hive.push.sh
chmod 755 ../docker/build/populatedEventstore/hive.push.sh
chmod 755 ../docker/build/web/hive.push.sh
chmod 755 buildContainers.sh
chmod 755 loadContainers.sh
chmod 755 saveContainers.sh
chmod 755 pushContainers.sh
chmod 755 runContainers.sh
