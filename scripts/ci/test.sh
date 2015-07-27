#!/bin/bash
set -e

./node_modules/.bin/gulp test/ci --browsers=${KARMA_BROWSERS:-CHROME_TRAVIS_CI}
./node_modules/.bin/gulp lint