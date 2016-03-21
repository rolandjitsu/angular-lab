#!/bin/bash
set -e

# Set the CI scripts dir location for executing unit/e2e tests
SCRIPT_DIR=$(dirname $0)

$(npm bin)/gulp lint
 ${SCRIPT_DIR}/test_unit.sh
 ${SCRIPT_DIR}/test_e2e.sh