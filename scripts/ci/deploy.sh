#!/bin/bash
set -e

# Only make deployments from the master,
# PRs will not be deployed.
if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]] && [[ "${TRAVIS_BRANCH}" == "master" ]]; then
    $(npm bin)/firebase deploy -P production \
        --token ${FIREBASE_TOKEN} \
        --non-interactive
fi
