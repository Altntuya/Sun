#!/usr/bin/env bash
# Copies the EduLab plugin from an erxes checkout into this repository.
# Usage: scripts/sync-from-erxes.sh [path-to-erxes]   (default: ../erxes)
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ERXES_DIR="$(cd "${1:-$REPO_DIR/../erxes}" && pwd)"

for project in backend/plugins/edulab_api frontend/plugins/edulab_ui; do
  mkdir -p "$REPO_DIR/$project"
  rsync -a --delete \
    --exclude node_modules --exclude dist --exclude .nx \
    "$ERXES_DIR/$project/" "$REPO_DIR/$project/"
  echo "synced $project"
done
