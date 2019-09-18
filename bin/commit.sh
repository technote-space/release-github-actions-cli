#!/usr/bin/env bash

set -e

# shellcheck disable=SC2046
current=$(
  cd $(dirname "${0}")
  pwd
)

# shellcheck disable=SC1090
source "${current}"/variables.sh

cd "${WORK_DIR}/${PROGRAM_REPO}"

node commit
