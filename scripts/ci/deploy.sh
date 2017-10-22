#!/bin/bash
set -e

# Only make deployments from the master,
# PRs will not be deployed.
if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]] && [[ "${TRAVIS_BRANCH}" == "master" ]]; then
    # Generate the .secrets.js file (frm which our env files read)
    npm run secrets:eject
    # Deploy app
    $(npm bin)/firebase deploy -P production \
        --token ${FIREBASE_TOKEN} \
        --non-interactive
fi
