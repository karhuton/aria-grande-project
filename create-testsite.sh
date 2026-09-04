#!/bin/sh

set -eu

rsync -a --delete --exclude "extension-embedded.js" "example-gov-website/gov.example/" "testsite/"

rsync -a browser-extension/release/bundle-embedded.js testsite/extension-embedded.js
