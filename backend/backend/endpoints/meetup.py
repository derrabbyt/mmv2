from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.services.db import get_session_depends
from backend.schemas.meetup import (
    MeetupCreate,
    MeetupUpdate,
    MeetupResponse,
    ParticipantCreate,
    ParticipantUpdate,
    ParticipantResponse,
)
from backend.repositories import meetup as repo
from backend.utils.geo import wkb_to_geojson

router = APIRouter()

# =========================
# Meetup Endpoints
# =========================

@router.post("/", response_model=MeetupResponse, status_code=status.HTTP_201_CREATED)
async def create_meetup(
    meetup_in: MeetupCreate, session: AsyncSession = Depends(get_session_depends)
):
    return await repo.create_meetup(session, meetup_in)


@router.get("/{meetup_id}", response_model=MeetupResponse)
async def get_meetup(meetup_id: UUID, session: AsyncSession = Depends(get_session_depends)):
    meetup = await repo.get_meetup(session, meetup_id)
    if not meetup:
        raise HTTPException(status_code=404, detail="Meetup not found")
    return meetup


@router.put("/{meetup_id}", response_model=MeetupResponse)
async def update_meetup(
    meetup_id: UUID, meetup_in: MeetupUpdate, session: AsyncSession = Depends(get_session_depends)
):
    meetup = await repo.update_meetup(session, meetup_id, meetup_in)
    if not meeup:
        raise HTTPException(status_code=404, detail="Meetup not found")
    return meetup


@router.delete("/{meetup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meetup(meetup_id: UUID, session: AsyncSession = Depends(get_session_depends)):
    success = await repo.delete_meetup(session, meetup_id)
    if not success:
        raise HTTPException(status_code=404, detail="Meetup not found")


# =========================
# Participant Endpoints
# =========================

def _participant_to_dict(p) -> dict:
    return {
        "id": p.id,
        "meetup_id": p.meetup_id,
        "name": p.name,
        "travel_mode": p.travel_mode,
        "max_minutes": p.max_minutes,
        "geom": wkb_to_geojson(p.geom),
    }


@router.post("/{meetup_id}/participants", response_model=ParticipantResponse, status_code=status.HTTP_201_CREATED)
async def add_participant(
    meetup_id: UUID,
    participant_in: ParticipantCreate,
    session: AsyncSession = Depends(get_session_depends),
):
    meetup = await repo.get_meetup(session, meetup_id)
    if not meetup:
        raise HTTPException(status_code=404, detail="Meetup not found")

    participant = await repo.add_participant(session, meetup_id, participant_in)
    return _participant_to_dict(participant)


@router.get("/{meetup_id}/participants", response_model=List[ParticipantResponse])
async def get_participants(
    meetup_id: UUID, session: AsyncSession = Depends(get_session_depends)
):
    meetup = await repo.get_meetup(session, meetup_id)
    if not meetup:
        raise HTTPException(status_code=404, detail="Meetup not found")

    participants = await repo.get_participants(session, meetup_id)
    return [_participant_to_dict(p) for p in participants]


@router.get("/participants/{participant_id}", response_model=ParticipantResponse)
async def get_participant(
    participant_id: UUID, session: AsyncSession = Depends(get_session_depends)
):
    participant = await repo.get_participant(session, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return _participant_to_dict(participant)


@router.put("/participants/{participant_id}", response_model=ParticipantResponse)
async def update_participant(
    participant_id: UUID,
    participant_in: ParticipantUpdate,
    session: AsyncSession = Depends(get_session_depends),
):
    participant = await repo.update_participant(session, participant_id, participant_in)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return _participant_to_dict(participant)


@router.delete("/participants/{participant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_participant(
    participant_id: UUID, session: AsyncSession = Depends(get_session_depends)
):
    success = await repo.remove_participant(session, participant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Participant not found")