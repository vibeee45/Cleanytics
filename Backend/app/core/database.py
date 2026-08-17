import logging
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import text

from app.core.config import settings

logger = logging.getLogger("cleanytics.database")

db_url = settings.DATABASE_URL
# Fallback to local SQLite if PostgreSQL is not reachable locally
sqlite_fallback_url = "sqlite+aiosqlite:///./cleanytics_local.db"

try:
    engine = create_async_engine(
        db_url,
        echo=False,
        pool_pre_ping=True,
    )
except Exception as e:
    logger.warning(f"PostgreSQL engine init failed ({e}), falling back to SQLite.")
    engine = create_async_engine(sqlite_fallback_url, echo=False)


AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session