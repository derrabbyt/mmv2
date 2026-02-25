import asyncio
import os
import sys

backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../backend')
sys.path.append(backend_dir)

from parse_osm import process_osm
from parse_google import process_google
from map_pois import calculate_mappings
from backend.conf.db import DatabaseSettings
from sqlalchemy import create_engine
import geoalchemy2

def main():
    print("Starting POI Initialization Process...")
    settings = DatabaseSettings()
    db_url = settings.alembic_database_url
    engine = create_engine(db_url, echo=False)
    
    try:
        process_osm(engine)
        process_google(engine)
        calculate_mappings(engine)
    except Exception as e:
        print(f"Error occurred during POI initialization: {e}")
    finally:
        engine.dispose()
        print("POI Initialization Process Complete.")

if __name__ == "__main__":
    main()
