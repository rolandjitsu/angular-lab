#!/bin/bash
set -e

function killServer () {
	kill $serverPid
}

./node_modules/.bin/webdriver-manager update # update selenium webdriver
./node_modules/.bin/gulp build # bundle the app
./node_modules/.bin/gulp server & serverPid=$! # start the web server required by protractor and save PID so that on exit gets closed

trap killServer EXIT

sleep 5 # wait for the web server to come up

# Let protractor use the default browser unless one is specified
OPTIONS="";
if [[ -n "${E2E_BROWSERS}" ]]; then
	OPTIONS="--browsers=${E2E_BROWSERS}";
fi

./node_modules/.bin/protractor protractor.config.js ${OPTIONS}