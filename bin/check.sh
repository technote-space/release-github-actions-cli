#!/usr/bin/env bash

set -e

EXIT=0
if [[ -z "${TARGET_OWNER}" ]]; then
  echo "<TARGET_OWNER> is required."
  EXIT=1
fi
if [[ -z "${TARGET_REPO}" ]]; then
  echo "<TARGET_REPO> is required."
  EXIT=1
fi
if [[ $# -lt 2 ]]; then
	echo "usage: $0 <tag> <token>"
	EXIT=1
fi

exit ${EXIT}
