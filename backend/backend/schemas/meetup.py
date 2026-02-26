from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from geojson_pydantic import Point, MultiPolygon
from backend.utils.enums import MeetupStatusEnum, CategoryEnum

# =========================
# Meetup Schemas
# =========================

class Meetup(BaseModel):
    id: UUID
    title: str
    city: str
    pinCode: Optional[str] = None
    date: Optional[datetime] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    types: List[str]
    status: MeetupStatusEnum = MeetupStatusEnum.ACTIVE
    expires_at: Optional[datetime] = None









class MeetupCreate(BaseModel):
    title: str
    city: str
    pinCode: Optional[str] = None
    date: Optional[datetime] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    types: List[str]


class MeetupUpdate(BaseModel):
    title: Optional[str] = None
    city: Optional[str] = None
    pinCode: Optional[str] = None
    date: Optional[datetime] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    types: Optional[List[str]] = None
    
    status: Optional[MeetupStatusEnum] = None
    expires_at: Optional[datetime] = None


class MeetupResponse(MeetupCreate):
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
