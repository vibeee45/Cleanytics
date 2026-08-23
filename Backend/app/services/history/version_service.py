from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.dataset_version import DatasetVersion
from app.services.history.version_repository import VersionRepository


class VersionService:
    """
    Service for dataset version history.

    Handles:
    - validation
    - version creation
    - version retrieval
    - version listing
    - latest-version lookup
    """

    @staticmethod
    def _validate_dataset_id(
        dataset_id: str,
    ) -> str:
        if not dataset_id:
            raise ValueError(
                "dataset_id is required."
            )

        try:
            UUID(str(dataset_id))
        except (ValueError, TypeError) as exc:
            raise ValueError(
                "dataset_id must be a valid UUID."
            ) from exc

        return str(dataset_id)

    @staticmethod
    def _validate_version_number(
        version_number: int,
    ) -> int:

        if not isinstance(
            version_number,
            int,
        ):
            raise ValueError(
                "version_number must be an integer."
            )

        if version_number <= 0:
            raise ValueError(
                "version_number must be greater than 0."
            )

        return version_number

    @staticmethod
    def _validate_file_path(
        cleaned_file_path: str,
    ) -> str:

        if not isinstance(
            cleaned_file_path,
            str,
        ):
            raise ValueError(
                "cleaned_file_path must be a string."
            )

        cleaned_file_path = (
            cleaned_file_path.strip()
        )

        if not cleaned_file_path:
            raise ValueError(
                "cleaned_file_path cannot be empty."
            )

        return cleaned_file_path

    @staticmethod
    def _validate_quality_score(
        quality_score: float,
    ) -> float:

        if not isinstance(
            quality_score,
            (int, float),
        ):
            raise ValueError(
                "quality_score must be numeric."
            )

        if not 0 <= quality_score <= 100:
            raise ValueError(
                "quality_score must be between 0 and 100."
            )

        return float(quality_score)

    @staticmethod
    async def create_version(
        session: AsyncSession,
        dataset_id: str,
        version_number: int,
        cleaned_file_path: str,
        quality_score: float = 0.0,
        summary_json: str | None = None,
    ) -> DatasetVersion:
        """
        Create and persist a dataset version.
        """

        dataset_id = (
            VersionService._validate_dataset_id(
                dataset_id
            )
        )

        version_number = (
            VersionService._validate_version_number(
                version_number
            )
        )

        cleaned_file_path = (
            VersionService._validate_file_path(
                cleaned_file_path
            )
        )

        quality_score = (
            VersionService._validate_quality_score(
                quality_score
            )
        )

        if summary_json is not None:

            if not isinstance(
                summary_json,
                str,
            ):
                raise ValueError(
                    "summary_json must be a string or None."
                )

            summary_json = summary_json.strip()

            if not summary_json:
                summary_json = None

        # --------------------------------
        # Create ORM object
        # --------------------------------

        version = DatasetVersion(
            id=str(uuid4()),
            dataset_id=dataset_id,
            version_number=version_number,
            cleaned_file_path=cleaned_file_path,
            quality_score=quality_score,
            summary_json=summary_json,
            created_at=datetime.now(
                timezone.utc
            ),
        )

        # --------------------------------
        # Persist
        # --------------------------------

        return await VersionRepository.create(
            session,
            version,
        )

    @staticmethod
    async def get_version(
        session: AsyncSession,
        version_id: str,
    ) -> DatasetVersion | None:
        """
        Get a specific dataset version.
        """

        try:
            UUID(str(version_id))
        except (ValueError, TypeError) as exc:
            raise ValueError(
                "version_id must be a valid UUID."
            ) from exc

        return await VersionRepository.get_by_id(
            session,
            str(version_id),
        )

    @staticmethod
    async def list_versions(
        session: AsyncSession,
        dataset_id: str,
    ) -> list[DatasetVersion]:
        """
        Get all versions for a dataset.
        """

        dataset_id = (
            VersionService._validate_dataset_id(
                dataset_id
            )
        )

        return await VersionRepository.get_all_by_dataset(
            session,
            dataset_id,
        )

    @staticmethod
    async def get_latest_version(
        session: AsyncSession,
        dataset_id: str,
    ) -> DatasetVersion | None:
        """
        Get the latest version of a dataset.
        """

        dataset_id = (
            VersionService._validate_dataset_id(
                dataset_id
            )
        )

        return await VersionRepository.get_latest(
            session,
            dataset_id,
        )