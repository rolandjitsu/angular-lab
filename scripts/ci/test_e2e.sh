#!/bin/bash
set -e

NPM_BIN="./node_modules/.bin"

function killServer () {
	kill $serverPid
}

# Start a web server required by protractor to run the tests and save the process PID so that on exit we can kill it and stop the server
${NPM_BIN}/http-server ./dist/app -p 3000 --silent & serverPid=$!
echo "Server running at http://localhost:3000"
# Update selenium webdriver
${NPM_BIN}/webdriver-manager update

# On EXIT kill the server PID
trap killServer EXIT

# Wait for the web server to come up
sleep 5

# Let protractor use the default browser unless one is specified
OPTIONS="";
if [[ -n "${E2E_BROWSERS}" ]]; then
	OPTIONS="--browsers=${E2E_BROWSERS}";
fi

${NPM_BIN}/protractor \
	protractor.config.js \
	${OPTIONS}