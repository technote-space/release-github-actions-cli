#!/usr/bin/env bash

set -e

if [[ -z "${TARGET_OWNER}" ]]; then
  echo "<TARGET_OWNER> is required."
  exit 1
fi
if [[ -z "${TARGET_REPO}" ]]; then
  echo "<TARGET_REPO> is required."
  exit 1
fi
if [[ $# -lt 1 ]]; then
	echo "usage: $0 <tag>"
	exit 1
fi

# shellcheck disable=SC2046
current=$(
  cd $(dirname "${0}")
  pwd
)

# shellcheck disable=SC1090
source "${current}"/variables.sh

cd "${WORK_DIR}/${PROGRAM_REPO}"

node prepare "${TARGET_OWNER}" "${TARGET_REPO}" "${1}"
