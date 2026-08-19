#!/usr/bin/env bash
set -e

command="$1"
stage="$2"

if [ -z "$stage" ]; then
  echo "Usage: npm run <delete|deploy> -- <beta|prod>" >&2
  exit 1
fi

cp "./deployment/serverless.yaml" ./serverless.yaml

set +e
STAGE="$stage" bash -c "$command"
status=$?
set -e

rm -f ./serverless.yaml
exit $status
