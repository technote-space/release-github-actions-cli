#!/usr/bin/env bash

set -e

if [[ -z "${ROOT_DIR}" ]]; then
  echo "<ROOT_DIR> is required."
  exit 1
fi

PROGRAM_OWNER=technote-space
PROGRAM_REPO=release-github-actions
CLONE_URL=https://github.com/"${PROGRAM_OWNER}"/"${PROGRAM_REPO}".git
WORK_DIR="${ROOT_DIR}"/.work
