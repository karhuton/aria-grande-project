#!/bin/sh

set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$project_dir"

rm -rf "$project_dir/release"
mkdir -p "$project_dir/release"

if [ -x ./node_modules/.bin/esbuild ]; then
  esbuild=./node_modules/.bin/esbuild
elif command -v esbuild >/dev/null 2>&1; then
  esbuild=$(command -v esbuild)
else
  echo "Esbuild was not found. Run: npm install --save-dev" >&2
  exit 1
fi

"$esbuild" src-content/main.js --bundle --format=iife --outfile=release/content.js

cp src-content/content.html release/
cp src-menu/menu.js release/
cp src-menu/menu.html release/
mkdir -p release/icons
cp -R icons/. release/icons/
cp manifest.json release/
