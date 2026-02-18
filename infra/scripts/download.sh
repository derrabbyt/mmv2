#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/../data"

echo "=== Downloading data files ==="

# --- GTFS ---
mkdir -p "$DATA_DIR/gtfs"

echo "[1/4] Downloading Wiener Linien GTFS..."
curl -L -o "$DATA_DIR/gtfs/wl.zip" \
  "http://www.wienerlinien.at/ogd_realtime/doku/ogd/gtfs/gtfs.zip"

echo "[2/4] Downloading ÖBB GTFS 2026..."
curl -L -o "$DATA_DIR/gtfs/oebb.zip" \
  "https://static.web.oebb.at/open-data/soll-fahrplan-gtfs/GTFS_Fahrplan_2026.zip"

# --- OSM PBF ---
mkdir -p "$DATA_DIR/osm"

echo "[3/4] Downloading Austria OSM PBF..."
curl -L -o "$DATA_DIR/osm/austria.osm.pbf" \
  "https://download.geofabrik.de/europe/austria-latest.osm.pbf"

echo "[4/4] Downloading Vienna OSM PBF..."
curl -L -o "$DATA_DIR/osm/vienna.osm.pbf" \
  "https://download.bbbike.org/osm/bbbike/Wien/Wien.osm.pbf"

echo "=== Done ==="
echo "Files saved to:"
echo "  $DATA_DIR/gtfs/wl.zip"
echo "  $DATA_DIR/gtfs/oebb.zip"
echo "  $DATA_DIR/osm/austria.osm.pbf"
echo "  $DATA_DIR/osm/vienna.osm.pbf"
