from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.meetup import Meetup, MeetupParticipant
from backend.schemas.meetup import MeetupCreate, MeetupUpdate, ParticipantCreate, ParticipantUpdate
from backend.utils.geo import geojson_to_wkt

async def create_meetup(session: AsyncSession, data: MeetupCreate) -> Meetup:
    meetup = Meetup(**data.model_dump())
    session.add(meetup)
    await session.commit()
    await session.refresh(meetup)
    return meetup

async def get_meetup(session: AsyncSession, meetup_id: UUID) -> Optional[Meetup]:
    result = await session.execute(select(Meetup).where(Meetup.id == meetup_id))
    return result.scalar_one_or_none()

async def update_meetup(session: AsyncSession, meetup_id: UUID, data: MeetupUpdate) -> Optional[Meetup]:
    meetup = await get_meetup(session, meetup_id)
    if not meetup:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(meetup, key, value)
    await session.commit()
    await session.refresh(meetup)
    return meetup

async def delete_meetup(session: AsyncSession, meetup_id: UUID) -> bool:
    meetup = await get_meetup(session, meetup_id)
    if not meetup:
        return False
    await session.delete(meetup)
    await session.commit()
    return True

async def add_participant(session: AsyncSession, meetup_id: UUID, data: ParticipantCreate) -> MeetupParticipant:
    geom_wkt = geojson_to_wkt(data.geom.model_dump())
    participant = MeetupParticipant(
        meetup_id=meetup_id,
        name=data.name,
        travel_mode=data.travel_mode,
        max_minutes=data.max_minutes,
        geom=f"SRID=4326;{geom_wkt}"
    )
    session.add(participant)
    await session.commit()
    await session.refresh(participant)
    return participant

async def get_participants(session: AsyncSession, meetup_id: UUID) -> List[MeetupParticipant]:
    result = await session.execute(select(MeetupParticipant).where(MeetupParticipant.meetup_id == meetup_id))
    return list(result.scalars().all())

async def get_participant(session: AsyncSession, participant_id: UUID) -> Optional[MeetupParticipant]:
    result = await session.execute(select(MeetupParticipant).where(MeetupParticipant.id == participant_id))
    return result.scalar_one_or_none()

async def update_participant(session: AsyncSession, participant_id: UUID, data: ParticipantUpdate) -> Optional[MeetupParticipant]:
    participant = await get_participant(session, participant_id)
    if not participant:
        return None
    update_data = data.model_dump(exclude_unset=True)
    if "geom" in update_data and update_data["geom"]:
        geom_wkt = geojson_to_wkt(update_data["geom"])
        participant.geom = f"SRID=4326;{geom_wkt}"
    
    for key, value in update_data.items():
        if key != "geom":
            setattr(participant, key, value)
            
    await session.commit()
    await session.refresh(participant)
    return participant

async def remove_participant(session: AsyncSession, participant_id: UUID) -> bool:
    participant = await get_participant(session, participant_id)
    if not participant:
        return False
    await session.delete(participant)
    await session.commit()
    return True
