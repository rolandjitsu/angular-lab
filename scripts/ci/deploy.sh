#!/bin/bash
set -e

if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]] && [[ "${TRAVIS_BRANCH}" == "master" ]]; then
	./node_modules/.bin/gulp deploy/hosting:ci
fi