#!/bin/bash
set -e

function killServers() {
	if kill ${webServerPid}; then
		echo 'Web server was shut down.'
	fi
}

# Selenium webdriver
# Update
$(npm bin)/webdriver-manager update

# Start a web server required by protractor to run the tests.
# Save the process PID so that on exit we can kill the process and stop the server.
$(npm bin)/browser-sync start --config ./bs.config.js & webServerPid=$!

# On EXIT kill the servers
trap killServers EXIT

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