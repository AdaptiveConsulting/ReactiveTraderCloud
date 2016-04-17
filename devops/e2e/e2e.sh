#!/bin/bash
set -euo pipefail

usage() {
    echo "usage:"
    echo " $0 [OPTIONS]"
    echo " "
    echo " OPTIONS can be:"
    echo "  -t|--no-tty:  to disable tty (needed by jenkins build)"
    echo "  -r|--release: to run in production mode"
    echo "  -i=|--id=: build_id"
    echo "  -h=|--help:   print help and exit"
}

TTY=""
RELEASE="dev"
ID="e2e"
DOCKER_VERSION=""

for i in "${@}"; do
  case ${i} in
    -t|--no-tty)     TTY="--no-tty";                    shift 1;;
    -r|--release)    RELEASE="release";                 shift 1;;
    -i=*|--id=*)     ID="${i#*=}";                      shift 1;;
    -d=*|--docker=*) DOCKER_VERSION="--docker=${i#*=}"; shift 1;;
    -h|--help)       usage;                             exit 0;;
    -*) echo "unknown option: $1" >&2; usage;           exit 1;;
    *) ARGS="$@";                                       shift 1;;
  esac
done

startTime=$(date)

cd ../..

# STOP EVERYTHING
./hive ${DOCKER_VERSION} ${TTY} do kill devops/reactivetrader all

# BUILD
echo ""
echo "==============================="
./hive ${DOCKER_VERSION} ${TTY} do build devops/reactivetrader all id ${ID}

# RUN
echo ""
echo "============================="
echo "Run ReactiveTrader containers"
echo ""
./hive ${DOCKER_VERSION} ${TTY} do run devops/reactivetrader all id ${ID} configuration ${RELEASE}

# TEST
echo "Giving some time for services to start"
sleep 10
echo "NO TESTS !!!!"

# STOP
./hive ${DOCKER_VERSION} ${TTY} do kill devops/reactivetrader all
echo " "
echo "============="
echo "Time details:"
echo ${startTime}
date
