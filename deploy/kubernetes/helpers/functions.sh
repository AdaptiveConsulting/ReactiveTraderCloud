#! /bin/bash

listcontains() {
  for word in $1; do
    [[ $word = $2 ]] && return 0
  done
  return 1
}
