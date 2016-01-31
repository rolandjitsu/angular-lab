#!/bin/bash
set -e

if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]] && [[ "${TRAVIS_BRANCH}" == "master" ]]; then
	$(npm bin)/gulp deploy
fi