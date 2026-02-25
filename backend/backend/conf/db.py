from pydantic_settings import BaseSettings


class DatabaseSettings(BaseSettings):
    database_url: str = "postgresql+asyncpg://main:main12345@localhost:5432/main_new"
    alembic_database_url: str = "postgresql+psycopg://main:main12345@localhost:5432/main_new"