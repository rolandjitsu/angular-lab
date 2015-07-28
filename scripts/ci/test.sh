#!/bin/bash
set -e

./node_modules/.bin/gulp test:unit/ci:sauce
./node_modules/.bin/gulp lint