#!/bin/bash
set -e

function killServer () {
	kill $serverPid
}

# Start a web server required by protractor to run the tests and save the process PID so that on exit we can kill it and stop the server
$(npm bin)/http-server ./dist/app -p 3000 --silent & serverPid=$!
echo "Server running at http://localhost:3000"
# Update selenium webdriver
$(npm bin)/webdriver-manager update

# On EXIT kill the server PID
trap killServer EXIT

# Wait for the web server to come up
sleep 5

# Let protractor use the default browser unless one is specified
OPTIONS="";
if [[ -n "${E2E_BROWSERS}" ]]; then
	OPTIONS="--browsers=${E2E_BROWSERS}";
fi

$(npm bin)/protractor \
	protractor.config.js \
	${OPTIONS}