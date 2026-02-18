#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/../data"
VALHALLA_DIR="$DATA_DIR/valhalla"

echo "=== Preparing Valhalla data ==="

# --- Create Valhalla working directory ---
mkdir -p "$VALHALLA_DIR"

# --- Copy OSM PBF into Valhalla's custom_files ---
# The scripted image picks up any .osm.pbf in /custom_files
# Use Vienna by default (smaller, faster build). Switch to austria for full coverage.
OSM_FILE="${VALHALLA_OSM_FILE:-vienna.osm.pbf}"

if [ -f "$DATA_DIR/osm/$OSM_FILE" ]; then
  echo "[1/2] Copying $OSM_FILE into Valhalla directory..."
  cp -u "$DATA_DIR/osm/$OSM_FILE" "$VALHALLA_DIR/$OSM_FILE"
else
  echo "[1/2] WARNING: $DATA_DIR/osm/$OSM_FILE not found."
  echo "       Run infra/scripts/download.sh first, or set VALHALLA_OSM_FILE."
  exit 1
fi

# --- Unzip GTFS feeds into subdirectories ---
# Valhalla needs unzipped GTFS in named subdirs under /gtfs_feeds
echo "[2/2] Preparing GTFS feeds..."

GTFS_DIR="$DATA_DIR/gtfs"

if [ -f "$GTFS_DIR/wl.zip" ]; then
  echo "  Extracting Wiener Linien GTFS..."
  mkdir -p "$GTFS_DIR/wiener_linien"
  unzip -qo "$GTFS_DIR/wl.zip" -d "$GTFS_DIR/wiener_linien"
else
  echo "  Skipping Wiener Linien GTFS (wl.zip not found)"
fi

if [ -f "$GTFS_DIR/oebb.zip" ]; then
  echo "  Extracting ÖBB GTFS..."
  mkdir -p "$GTFS_DIR/oebb"
  unzip -qo "$GTFS_DIR/oebb.zip" -d "$GTFS_DIR/oebb"
else
  echo "  Skipping ÖBB GTFS (oebb.zip not found)"
fi

echo "=== Done ==="
echo "Valhalla data directory: $VALHALLA_DIR"
echo ""
echo "Next steps:"
echo "  docker compose up valhalla"
echo ""
echo "To use Austria instead of Vienna:"
echo "  VALHALLA_OSM_FILE=austria.osm.pbf bash $0"
