from contextlib import asynccontextmanager
import os
from typing import AsyncGenerator


from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from ..settings import settings

engine = create_async_engine(settings.database_url, future=True, echo=settings.debug)


@asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session


async def get_session_depends() -> AsyncGenerator[AsyncSession, None]:
    async with get_session() as session:
        yield session


async def test_data(session: AsyncSession) -> None:
    """Populate the test database with initial data."""
    if os.environ.get("IS_DEV", "") != "":
        raise ValueError("This function should not be called in production. Enable IS_DEV to run it in development.")

    # Example: Add initial data to the session
    # await session.add_all([YourModel(name="Test")])
    # await session.commit()
