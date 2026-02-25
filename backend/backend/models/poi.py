import uuid

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    Text,
    BigInteger,
    DateTime,
    UniqueConstraint,
    func
)

from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

from backend.models.base import Base

class GooglePOI(Base):
    __tablename__ = "google_pois"

    id = Column(Integer, primary_key=True)
    place_id = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    address = Column(Text)
    main_category = Column(String(100))
    raw_categories = Column(Text)
    raw_data = Column(JSONB)

    geom = Column(
        Geometry("POINT", srid=4326, spatial_index=True),
        nullable=True,
    )

    mappings = relationship(
        "PoiMapping",
        back_populates="google_poi",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

class OsmPOI(Base):
    __tablename__ = "osm_pois"

    id = Column(Integer, primary_key=True)
    osm_id = Column(BigInteger, unique=True, nullable=False, index=True)

    name = Column(String(255), nullable=True)
    cuisine = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    main_category = Column(String(100), nullable=True)
    raw_tags = Column(JSONB, nullable=True)

    geom = Column(
        Geometry("POINT", srid=4326, spatial_index=True),
        nullable=True,
    )

    mappings = relationship(
        "PoiMapping",
        back_populates="osm_poi",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class PoiMapping(Base):
    __tablename__ = "poi_mapping"

    __table_args__ = (
        UniqueConstraint("google_poi_id", "osm_poi_id"),
    )

    id = Column(Integer, primary_key=True)

    google_poi_id = Column(
        Integer,
        ForeignKey("google_pois.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    osm_poi_id = Column(
        Integer,
        ForeignKey("osm_pois.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    distance_meters = Column(Float, nullable=True)
    similarity_score = Column(Float, nullable=True)

    google_poi = relationship(
        "GooglePOI",
        back_populates="mappings",
    )
    osm_poi = relationship(
        "OsmPOI",
        back_populates="mappings",
    )
