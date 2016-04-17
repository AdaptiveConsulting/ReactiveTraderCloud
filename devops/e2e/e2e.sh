#!/bin/bash
set -euo pipefail

usage() {
    echo "usage:"
    echo " $0 [OPTIONS]"
    echo " "
    echo " OPTIONS can be:"
    echo "  -t|--no-tty:  to disable tty (needed by jenkins build)"
    echo "  -r|--release: to run in production mode"
    echo "  -b=|--build=: build id"
    echo "  -h=|--help:   print help and exit"
}

TTY=""
RELEASE="dev"
BUILD="e2e"
for i in "${@}"; do
  case ${i} in
    -t|--no-tty)  TTY="--no-tty";             shift 1;;
    -r|--release) RELEASE="release";          shift 1;;
    -i=*|--id=*)  ID="${i#*=}";               shift 1;;
    -h|--help)    usage;                      exit 0;;
    -*) echo "unknown option: $1" >&2; usage; exit 1;;
    *) ARGS="$@"; shift 1;;
  esac
done

startTime=$(date)

cd ../..

# STOP EVERYTHING
./hive ${TTY} do kill devops/reactivetrader all

# BUILD
echo ""
echo "==============================="
./hive ${TTY} do build devops/reactivetrader all id e2e

# RUN
echo ""
echo "============================="
echo "Run ReactiveTrader containers"
echo ""
./hive ${TTY} do run devops/reactivetrader all id ${ID} configuration ${RELEASE}

# TEST
echo "Giving some time for services to start"
sleep 10
echo "NO TESTS !!!!"

# STOP
./hive ${TTY} do kill devops/reactivetrader all
echo " "
echo "============="
echo "Time details:"
echo ${startTime}
date
