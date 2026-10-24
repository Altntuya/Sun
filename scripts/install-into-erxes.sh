#!/usr/bin/env bash
# Copies the EduLab plugin from this repository into an erxes checkout.
# Usage: scripts/install-into-erxes.sh [path-to-erxes]   (default: ../erxes)
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ERXES_DIR="$(cd "${1:-$REPO_DIR/../erxes}" && pwd)"

for project in backend/plugins/edulab_api frontend/plugins/edulab_ui; do
  mkdir -p "$ERXES_DIR/$project"
  rsync -a --delete \
    --exclude node_modules --exclude dist --exclude .nx \
    "$REPO_DIR/$project/" "$ERXES_DIR/$project/"
  echo "installed $project"
done

echo "Next: add edulab to ENABLED_PLUGINS in $ERXES_DIR/.env and run pnpm install there."
