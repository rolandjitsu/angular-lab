#!/bin/bash
set -e

# Set the CI scripts dir location for executing unit/e2e tests
SCRIPT_DIR=$(dirname $0)

$(npm bin)/gulp lint
${SCRIPT_DIR}/test_unit.sh
# Disable E2E tests until we can fix the socket error in console
#${SCRIPT_DIR}/test_e2e.sh
