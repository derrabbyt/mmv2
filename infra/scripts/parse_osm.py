"""
Initialization script for the DB that uses SQLAlchemy and Osmium to populate
the OSM POIs table from the PBF file.
"""
import asyncio
import os
import sys

# Append the project root or backend paths if needed so backend modules resolve.
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../backend')
sys.path.append(backend_dir)

import osmium
from geoalchemy2.elements import WKTElement
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.models.poi import OsmPOI
from backend.conf.db import DatabaseSettings

# Local categories logic reused
from infra.data.poi.categorize import map_category

OSM_PBF = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../data/osm/vienna.osm.pbf')

class OSMHandler(osmium.SimpleHandler):
    def __init__(self, session_maker):
        super(OSMHandler, self).__init__()
        self.session_maker = session_maker
        self.poi_keys = {'amenity', 'shop', 'tourism', 'leisure', 'office'}
        self.batch_size = 5000
        self.batch = []

    def get_address(self, tags):
        street = tags.get('addr:street', '')
        housenumber = tags.get('addr:housenumber', '')
        postcode = tags.get('addr:postcode', '')
        city = tags.get('addr:city', '')

        parts = []
        if street: parts.append(street)
        if housenumber: parts.append(housenumber)
        if postcode or city: parts.append(f"{postcode} {city}".strip())
        return ", ".join(parts) if parts else ""

    def process_element(self, tags, lat, lon, element_id):
        if not tags.get('name'):
            return

        if any(key in tags for key in self.poi_keys):
            name = tags.get('name', '')
            cuisine = tags.get('cuisine', '')
            address = self.get_address(tags)

            cat_str = ""
            for key in self.poi_keys:
                if key in tags:
                    cat_str = tags[key]
                    break

            main_category = map_category(cat_str)
            point_wkt = f"POINT({lon} {lat})"

            poi = OsmPOI(
                osm_id=element_id,
                name=name,
                cuisine=cuisine,
                address=address,
                main_category=main_category,
                raw_tags=dict(tags),
                geom=WKTElement(point_wkt, srid=4326)
            )
            self.batch.append(poi)

            if len(self.batch) >= self.batch_size:
                self.flush()

    def flush(self):
        if not self.batch:
            return
        
        with self.session_maker() as session:
            session.add_all(self.batch)
            try:
                session.commit()
            except Exception as e:
                print(f"Batch insert failed, might be conflicts: {e}")
                session.rollback()
        
        self.batch = []

    def node(self, n):
        self.process_element(n.tags, n.location.lat, n.location.lon, n.id)

    def area(self, a):
        lats, lons = [], []
        for outer_ring in a.outer_rings():
            for node in outer_ring:
                lats.append(node.lat)
                lons.append(node.lon)
        if lats and lons:
            avg_lat = sum(lats) / len(lats)
            avg_lon = sum(lons) / len(lons)
            self.process_element(a.tags, avg_lat, avg_lon, a.id)


def process_osm(engine):
    print(f"Processing OSM POIs from {OSM_PBF}...")
    if not os.path.exists(OSM_PBF):
        print(f"Skipping OSM: {OSM_PBF} not found.")
        return

    session_maker = sessionmaker(bind=engine)
    handler = OSMHandler(session_maker)
    handler.apply_file(OSM_PBF, locations=True)
    handler.flush()
    print("OSM parsing complete.")

def main():
    settings = DatabaseSettings()
    db_url = settings.alembic_database_url
    engine = create_engine(db_url, echo=False)
    
    process_osm(engine)
    engine.dispose()

if __name__ == "__main__":
    main()
