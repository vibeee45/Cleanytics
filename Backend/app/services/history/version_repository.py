from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.dataset_version import DatasetVersion


class VersionRepository:
    """
    Database operations for dataset versions.
    """

    @staticmethod
    async def create(
        session: AsyncSession,
        version: DatasetVersion,
    ) -> DatasetVersion:
        """
        Save a new dataset version.
        """

        session.add(version)

        await session.commit()

        await session.refresh(version)

        return version

    @staticmethod
    async def get_by_id(
        session: AsyncSession,
        version_id: str,
    ) -> DatasetVersion | None:
        """
        Get a dataset version by its ID.
        """

        result = await session.execute(
            select(DatasetVersion).where(
                DatasetVersion.id == version_id
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_by_dataset(
        session: AsyncSession,
        dataset_id: str,
    ) -> list[DatasetVersion]:
        """
        Get all versions belonging to a dataset.

        Versions are returned from newest to oldest.
        """

        result = await session.execute(
            select(DatasetVersion)
            .where(
                DatasetVersion.dataset_id
                == dataset_id
            )
            .order_by(
                desc(
                    DatasetVersion.version_number
                )
            )
        )

        return list(result.scalars().all())

    @staticmethod
    async def get_latest(
        session: AsyncSession,
        dataset_id: str,
    ) -> DatasetVersion | None:
        """
        Get the latest version of a dataset.
        """

        result = await session.execute(
            select(DatasetVersion)
            .where(
                DatasetVersion.dataset_id
                == dataset_id
            )
            .order_by(
                desc(
                    DatasetVersion.version_number
                )
            )
            .limit(1)
        )

        return result.scalar_one_or_none()