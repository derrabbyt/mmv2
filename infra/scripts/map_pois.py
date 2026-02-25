import asyncio
import difflib
import os
import sys

backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../backend')
sys.path.append(backend_dir)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

from backend.models.poi import PoiMapping
from backend.conf.db import DatabaseSettings

MAX_DISTANCE_METERS = 100
MIN_NAME_SIMILARITY = 0.60

def calculate_mappings(engine):
    print("Calculating mappings between OSM and Google POIs...")
    session_maker = sessionmaker(bind=engine)

    # PostGIS ST_DWithin used directly to find pairs. 
    query = text("""
        SELECT 
            o.id as osm_id, o.name as osm_name,
            g.id as google_id, g.name as google_name,
            ST_Distance(o.geom::geography, g.geom::geography) as dist
        FROM osm_pois o
        JOIN google_pois g ON ST_DWithin(o.geom::geography, g.geom::geography, :distance)
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {"distance": MAX_DISTANCE_METERS})
        rows = result.fetchall()

    mappings = []
    count = 0

    def flush_batch(b):
        if not b: return
        with session_maker() as session:
            session.add_all(b)
            try:
                session.commit()
            except Exception as e:
                print(f"Mapping Batch insert failed: {e}")
                session.rollback()

    for row in rows:
        osm_id = row.osm_id
        osm_name = row.osm_name
        g_id = row.google_id
        g_name = row.google_name
        dist = row.dist
        
        osm_name_clean = str(osm_name).lower() if osm_name else ""
        g_name_clean = str(g_name).lower() if g_name else ""
        
        similarity = difflib.SequenceMatcher(None, osm_name_clean, g_name_clean).ratio()
        
        if similarity >= MIN_NAME_SIMILARITY:
            mapping = PoiMapping(
                google_poi_id=g_id,
                osm_poi_id=osm_id,
                distance_meters=dist,
                similarity_score=similarity
            )
            mappings.append(mapping)
            count += 1
            
            if len(mappings) >= 5000:
                flush_batch(mappings)
                mappings = []

    if mappings:
        flush_batch(mappings)

    print(f"Mapping calculation complete. Created {count} mappings.")

def main():
    settings = DatabaseSettings()
    db_url = settings.alembic_database_url
    engine = create_engine(db_url, echo=False)
    calculate_mappings(engine)
    engine.dispose()

if __name__ == "__main__":
    main()
