#!/bin/sh

set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

"$project_dir/browser-extension/build.sh"
node "$project_dir/example-gov-website/extract-content.js"

rsync -a --delete --exclude "extension-embedded.js" \
  "$project_dir/example-gov-website/gov.example/" "$project_dir/testsite/"

cp "$project_dir/example-gov-website/gov.example/content.txt" \
  "$project_dir/testsite/content.txt"
cp "$project_dir/browser-extension/release/bundle-embedded.js" \
  "$project_dir/testsite/extension-embedded.js"
