#! /bin/bash

#fail fast
set -euo pipefail

echo ""
echo "=============================="
echo "Test ReactiveTrader containers"
echo ""

cd ../docker
./testAll.sh
cd ../e2e
