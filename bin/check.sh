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
if [[ -z "${GITHUB_TOKEN}" ]]; then
  echo "<GITHUB_TOKEN> is required."
  EXIT=1
fi
if [[ $# -lt 1 ]]; then
	echo "usage: $0 <tag> [branch]"
	EXIT=1
fi

exit ${EXIT}
