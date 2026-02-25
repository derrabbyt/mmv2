import asyncio
import json
import os
import sys

backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../backend')
sys.path.append(backend_dir)

from geoalchemy2.elements import WKTElement
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.models.poi import GooglePOI
from backend.conf.db import DatabaseSettings

from infra.data.poi.categorize import map_category

GOOGLE_JSONL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../data/poi/google_pois.jsonl')

def process_google(engine):
    print(f"Processing Google POIs from {GOOGLE_JSONL}...")
    if not os.path.exists(GOOGLE_JSONL):
        print(f"Skipping Google: {GOOGLE_JSONL} not found.")
        return

    session_maker = sessionmaker(bind=engine)
    batch = []
    batch_size = 5000
    seen_places = set()

    def flush_batch(b):
        if not b: return
        with session_maker() as session:
            session.add_all(b)
            try:
                session.commit()
            except Exception as e:
                print(f"Google Batch insert failed: {e}")
                session.rollback()

    with open(GOOGLE_JSONL, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line: continue
            
            try:
                place = json.loads(line)
            except:
                continue
                
            place_id = place.get('place_id')
            if not place_id: continue
            if place_id in seen_places: continue
            seen_places.add(place_id)
            
            name = place.get('name', '')
            address = place.get('address', '')
            
            coords = place.get('coordinates', {})
            lat = coords.get('latitude')
            lon = coords.get('longitude')
            
            if lat is None or lon is None: continue
            
            raw_cats = " ".join(place.get('categories', []))
            main_cat = map_category(raw_cats)
            
            point_wkt = f"POINT({lon} {lat})"

            poi = GooglePOI(
                place_id=place_id,
                name=name,
                address=address,
                main_category=main_cat,
                raw_categories=raw_cats,
                raw_data=place,
                geom=WKTElement(point_wkt, srid=4326)
            )
            batch.append(poi)

            if len(batch) >= batch_size:
                flush_batch(batch)
                batch = []
                
    if batch:
        flush_batch(batch)
    print("Google parsing complete.")

def main():
    settings = DatabaseSettings()
    db_url = settings.alembic_database_url
    engine = create_engine(db_url, echo=False)
    process_google(engine)
    engine.dispose()

if __name__ == "__main__":
    main()
