import uuid

from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
    Index,
    func,
    JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

from backend.models.base import Base


class Meetup(Base):
    __tablename__ = "meetups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    pinCode = Column(String(20), nullable=True)
    date = Column(DateTime(timezone=True), nullable=True)
    startTime = Column(String(20), nullable=True)
    endTime = Column(String(20), nullable=True)
    types = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="active")

    participants = relationship(
        "MeetupParticipant",
        back_populates="meetup",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class MeetupParticipant(Base):
    __tablename__ = "meetup_participants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    meetup_id = Column(
        UUID(as_uuid=True),
        ForeignKey("meetups.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name = Column(String(100), nullable=False)

    geom = Column(
        Geometry("POINT", srid=4326, spatial_index=True),
        nullable=False,
    )

    travel_mode = Column(String(20), nullable=False)
    max_minutes = Column(Integer, nullable=False)

    meetup = relationship("Meetup", back_populates="participants")

    isochrones = relationship(
        "MeetupIsochrone",
        back_populates="participant",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class MeetupIsochrone(Base):
    __tablename__ = "meetup_isochrones"

    id = Column(Integer, primary_key=True)

    participant_id = Column(
        UUID(as_uuid=True),
        ForeignKey("meetup_participants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    geom = Column(
        Geometry("MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=False,
    )

    participant = relationship("MeetupParticipant", back_populates="isochrones")
