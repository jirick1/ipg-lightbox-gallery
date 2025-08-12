#!/usr/bin/env bash
set -euo pipefail

# Resolve binaries: prefer local vendor/ then global
PHPCBF="${PHPCBF:-vendor/bin/phpcbf}"
PHPCS="${PHPCS:-vendor/bin/phpcs}"

if ! command -v "$PHPCBF" >/dev/null 2>&1; then PHPCBF="$(pwd)/vendor/bin/phpcbf"; fi
if ! command -v "$PHPCS"  >/dev/null 2>&1; then PHPCS="$(pwd)/vendor/bin/phpcs";  fi

[ "$#" -eq 0 ] && exit 0

"$PHPCBF" --standard=phpcs.xml "$@" || true

git add -- "$@" || true # Re-add any modified files so they’re included in the commit

# 2) Lint (fail if errors remain). Treat warnings as warnings (not fatal).
# If you want warnings to fail the commit too, add: --warning-severity=1
"$PHPCS" --standard=phpcs.xml --report=full "$@"
