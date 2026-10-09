#!/usr/bin/env bash
# Builds the playable page (docs/index.html, served by GitHub Pages) from src/game.html.
set -euo pipefail
cd "$(dirname "$0")/.."
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<style>body{margin:0}</style>\n</head>\n<body>\n'
  cat src/game.html
  printf '\n</body>\n</html>\n'
} > docs/index.html
echo "Built docs/index.html"
