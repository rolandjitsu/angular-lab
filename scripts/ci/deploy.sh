#!/bin/bash
set -e

if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]] && [[ "${TRAVIS_BRANCH}" == "master" ]]; then
	echo -e "${FIREBASE_EMAIL}\n${FIREBASE_PASSWORD}" | firebase deploy;
fi