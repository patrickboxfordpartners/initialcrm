#!/bin/bash
set -e
cd /vercel/share/v0-project

echo "=== Extracting initialcrm-main.zip ==="
unzip -o initialcrm-main.zip

# If files are nested in a subdirectory, move them up
if [ -d "initialcrm-main" ]; then
  echo "=== Moving files from initialcrm-main/ to root ==="
  shopt -s dotglob
  cp -rn initialcrm-main/* . 2>/dev/null || true
  rm -rf initialcrm-main
fi

echo "=== Done. Listing top-level structure ==="
ls -la
echo "=== Checking for app directory ==="
ls -la app/ 2>/dev/null || echo "No app directory found"
echo "=== Checking for pages directory ==="
ls -la pages/ 2>/dev/null || echo "No pages directory found"
