#!/bin/bash
set -e

./node_modules/.bin/bower install
./node_modules/.bin/tsd install
./node_modules/.bin/gulp build