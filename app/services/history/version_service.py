from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import UUID, uuid4


class VersionOperation(str, Enum):
    """
    Operations that can create a dataset version.
    """

    UPLOAD = "upload"
    CLEANING = "cleaning"
    TRANSFORMATION = "transformation"
    UPDATE = "update"


class VersionService:
    """
    Service responsible for creating dataset version records.

    This layer only creates and validates version metadata.
    Database persistence will be handled separately.
    """

    @staticmethod
    def create_version_record(
        dataset_id: int,
        version_number: int,
        operation: VersionOperation | str,
        rows: int,
        columns: int,
        created_by: int | None = None,
        file_reference: str | None = None,
        version_id: UUID | str | None = None,
    ) -> dict[str, Any]:
        """
        Create a validated dataset version record.

        Args:
            dataset_id:
                ID of the dataset this version belongs to.

            version_number:
                Sequential version number for the dataset.

            operation:
                Operation that created this version.

            rows:
                Number of rows in this version.

            columns:
                Number of columns in this version.

            created_by:
                ID of the user who created the version.

            file_reference:
                Reference/path to the stored dataset file.

            version_id:
                Optional existing version UUID.
                A new UUID is generated if omitted.

        Returns:
            A JSON-serializable version record.

        Raises:
            ValueError:
                If any supplied value is invalid.
        """

        # --------------------------------
        # Validate dataset ID
        # --------------------------------

        if not isinstance(dataset_id, int):
            raise ValueError(
                "dataset_id must be an integer."
            )

        if dataset_id <= 0:
            raise ValueError(
                "dataset_id must be greater than 0."
            )

        # --------------------------------
        # Validate version number
        # --------------------------------

        if not isinstance(version_number, int):
            raise ValueError(
                "version_number must be an integer."
            )

        if version_number <= 0:
            raise ValueError(
                "version_number must be greater than 0."
            )

        # --------------------------------
        # Validate operation
        # --------------------------------

        try:
            operation = VersionOperation(operation)
        except ValueError as exc:
            allowed_operations = ", ".join(
                item.value
                for item in VersionOperation
            )

            raise ValueError(
                f"Invalid version operation "
                f"'{operation}'. "
                f"Allowed operations: "
                f"{allowed_operations}."
            ) from exc

        # --------------------------------
        # Validate row count
        # --------------------------------

        if not isinstance(rows, int):
            raise ValueError(
                "rows must be an integer."
            )

        if rows < 0:
            raise ValueError(
                "rows cannot be negative."
            )

        # --------------------------------
        # Validate column count
        # --------------------------------

        if not isinstance(columns, int):
            raise ValueError(
                "columns must be an integer."
            )

        if columns < 0:
            raise ValueError(
                "columns cannot be negative."
            )

        # --------------------------------
        # Validate created_by
        # --------------------------------

        if created_by is not None:

            if not isinstance(created_by, int):
                raise ValueError(
                    "created_by must be an integer "
                    "or None."
                )

            if created_by <= 0:
                raise ValueError(
                    "created_by must be greater than 0."
                )

        # --------------------------------
        # Normalize file reference
        # --------------------------------

        if file_reference is not None:

            if not isinstance(
                file_reference,
                str,
            ):
                raise ValueError(
                    "file_reference must be a string "
                    "or None."
                )

            file_reference = (
                file_reference.strip()
            )

            if not file_reference:
                file_reference = None

        # --------------------------------
        # Version ID
        # --------------------------------

        if version_id is None:

            generated_version_id = uuid4()

        else:

            try:
                generated_version_id = UUID(
                    str(version_id)
                )
            except (ValueError, TypeError) as exc:
                raise ValueError(
                    "version_id must be a valid UUID."
                ) from exc

        # --------------------------------
        # Timestamp
        # --------------------------------

        created_at = datetime.now(
            timezone.utc
        )

        # --------------------------------
        # Build record
        # --------------------------------

        return {
            "version_id": str(
                generated_version_id
            ),
            "dataset_id": dataset_id,
            "version_number": version_number,
            "created_at": created_at.isoformat(),
            "created_by": created_by,
            "operation": operation.value,
            "rows": rows,
            "columns": columns,
            "file_reference": file_reference,
        }