#!/usr/bin/env bash

set -euo pipefail

BASE_URL="http://localhost:3000"
ENV_NAME="local"
SRC_DIR=$(dirname "$0")
OUT_DIR="$SRC_DIR/../openfin-dist"

while getopts "b:e:" param; do
  case "$param" in
  b) BASE_URL="$OPTARG";;
  e) ENV_NAME="$OPTARG";;
  [?]) echo "Usage: $0 [-b base_url] [-e env_name]"; exit 1;;
  esac
done

ENV_SUFFIX=$(echo -n " $ENV_NAME" | awk '{print toupper($0)}')

mkdir -p $OUT_DIR/config

cat ${SRC_DIR}/app.json \
  | sed "s|<BASE_URL>|${BASE_URL}|g" \
  | sed "s|<ENV_NAME>|${ENV_NAME}|g" \
  | sed "s|<ENV_SUFFIX>|${ENV_SUFFIX}|g" \
  > $OUT_DIR/config/app.json
