from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from geojson_pydantic import Point, MultiPolygon
from enum import Enum


class MeetupStatusEnum(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


# =========================
# Meetup Schemas
# =========================

class MeetupBase(BaseModel):
    title: Optional[str] = None
    status: MeetupStatusEnum = MeetupStatusEnum.ACTIVE
    expires_at: Optional[datetime] = None


class MeetupCreate(MeetupBase):
    pass


class MeetupUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[MeetupStatusEnum] = None
    expires_at: Optional[datetime] = None


class MeetupResponse(MeetupBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================
# Participant Schemas
# =========================

class ParticipantBase(BaseModel):
    name: str
    travel_mode: str
    max_minutes: int


class ParticipantCreate(ParticipantBase):
    geom: Point


class ParticipantUpdate(BaseModel):
    name: Optional[str] = None
    travel_mode: Optional[str] = None
    max_minutes: Optional[int] = None
    geom: Optional[Point] = None


class ParticipantResponse(ParticipantBase):
    id: UUID
    meetup_id: UUID
    geom: Point

    model_config = ConfigDict(from_attributes=True)


# =========================
# Isochrone Schemas
# =========================

class IsochroneResponse(BaseModel):
    id: int
    participant_id: UUID
    geom: MultiPolygon

    model_config = ConfigDict(from_attributes=True)
