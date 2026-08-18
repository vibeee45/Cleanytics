import logging
import socket
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

logger = logging.getLogger("cleanytics.database")


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass


def is_postgres_available(host: str = "localhost", port: int = 5432) -> bool:
    """Quick socket check to verify if PostgreSQL port is open."""
    try:
        with socket.create_connection((host, port), timeout=0.5):
            return True
    except Exception:
        return False


db_url = settings.DATABASE_URL
sqlite_url = "sqlite+aiosqlite:///./cleanytics_local.db"

engine = create_async_engine(db_url, echo=False, pool_pre_ping=True)
fallback_engine = create_async_engine(sqlite_url, echo=False)

PrimarySessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
FallbackSessionLocal = async_sessionmaker(bind=fallback_engine, class_=AsyncSession, expire_on_commit=False)
AsyncSessionLocal = PrimarySessionLocal


async def get_db():
    if is_postgres_available():
        async with PrimarySessionLocal() as session:
            yield session
    else:
        # Fallback to local SQLite if PostgreSQL port 5432 is offline locally
        async with fallback_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        async with FallbackSessionLocal() as session:
            yield session