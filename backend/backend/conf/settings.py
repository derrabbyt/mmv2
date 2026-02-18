from .db import DatabaseSettings


class Settings(DatabaseSettings):
    project_name: str = "backend"
    debug: bool = False
