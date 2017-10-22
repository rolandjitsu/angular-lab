#!/bin/bash
set -e


# Read the .secrets file (line by line) and generate a .secrets.js file
# NOTE: Each secret is expected to be set as env var
# module.exports = {
#     [secret name]: <secret value>
# }

SECRETS="module.exports = {"

i=0
while read secret; do
    if [[ "${i}" != "0" ]]; then
        SECRETS="${SECRETS},"
    fi
    SECRETS="${SECRETS}\n\t${secret}: '${!secret}'"
    i=$((i+1))
done < .secrets

echo -e "${SECRETS}\n};" > .secrets.js
