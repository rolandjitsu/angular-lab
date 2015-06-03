#!/bin/bash
set -e

if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]]; then
	echo -e "${FIREBASE_EMAIL}\n${FIREBASE_PASSWORD}" | firebase deploy;
fi