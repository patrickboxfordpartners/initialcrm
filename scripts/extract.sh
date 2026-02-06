#!/bin/bash
cd /vercel/share/v0-project
# List zip contents first to understand structure
unzip -l initialcrm-main.zip | head -50
echo "---"
# Extract the zip, overwriting existing files
unzip -o initialcrm-main.zip
# Check if files are in a subdirectory
if [ -d "initialcrm-main" ]; then
  echo "Moving files from initialcrm-main/ to project root..."
  # Use rsync-like approach: copy all contents to root
  cp -r initialcrm-main/* . 2>/dev/null
  cp -r initialcrm-main/.* . 2>/dev/null
  rm -rf initialcrm-main
fi
# List what we have now
echo "=== Project structure after extraction ==="
find . -maxdepth 3 -not -path './node_modules/*' -not -path './.next/*' -not -path './user_read_only_context/*' | head -80
