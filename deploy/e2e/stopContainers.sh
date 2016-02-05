#! /bin/bash

echo ""
echo "=============================="
echo "Stop ReactiveTrader containers"
echo ""

cd ../docker
./killAll.sh
cd ../e2e
