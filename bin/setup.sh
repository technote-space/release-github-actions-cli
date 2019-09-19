#!/usr/bin/env bash

set -e

# shellcheck disable=SC2046
current=$(
  cd $(dirname "${0}")
  pwd
)

# shellcheck disable=SC1090
source "${current}"/variables.sh

mkdir -p "${WORK_DIR}"/"${PROGRAM_REPO}"/.git
chmod -R +w "${WORK_DIR}"/"${PROGRAM_REPO}"/.git
rm -rdf "${WORK_DIR}"
mkdir -p "${WORK_DIR}"
cd "${WORK_DIR}"

git clone "${CLONE_URL}" -b test/v1 --depth=1 "${PROGRAM_REPO}"
cd "${PROGRAM_REPO}"

cp "${current}"/fixture/*.js "${WORK_DIR}"/"${PROGRAM_REPO}"/
