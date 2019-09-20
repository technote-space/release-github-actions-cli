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
if [[ $# -lt 2 ]]; then
	echo "usage: $0 <tag> <token> [ref]"
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

if [[ $# -lt 3 ]]; then
  node push "${TARGET_OWNER}" "${TARGET_REPO}" "${1}" "${2}"
else
  node push "${TARGET_OWNER}" "${TARGET_REPO}" "${1}" "${2}" "${3}"
fi
