#!/usr/bin/env bash
# Exit on error: https://stackoverflow.com/a/2871034/5259610
set -euxo pipefail

# read environment variables from .env file
set -a
source .env
set +a

# read name of the env variable to use
ssh_env_variable=$1

echo "Deploying to ${!ssh_env_variable}"

rsync -Pav --delete --exclude '*.map' ./out/ "${!ssh_env_variable}"
