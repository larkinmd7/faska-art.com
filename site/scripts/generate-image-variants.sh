#!/usr/bin/env bash
set -euo pipefail

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required: install the 'magick' command" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$(cd "$SCRIPT_DIR/../public/images" && pwd)"
OUTPUT_DIR="$IMAGES_DIR/optimized"
mkdir -p "$OUTPUT_DIR"

generate_image_variants() {
  local source="$1"
  local filename stem
  filename="$(basename "$source")"
  stem="${filename%.*}"

  magick "$source" -auto-orient -strip -resize '800x1000>' -quality 55 \
    "$OUTPUT_DIR/${stem}-thumb.avif"
  magick "$source" -auto-orient -strip -resize '1600x2000>' -quality 58 \
    "$OUTPUT_DIR/${stem}-full.avif"
}

export -f generate_image_variants
export OUTPUT_DIR

find "$IMAGES_DIR" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) -print0 \
  | xargs -0 -n 1 -P 4 bash -c 'generate_image_variants "$1"' _
