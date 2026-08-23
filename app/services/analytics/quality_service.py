import pandas as pd


class QualityService:

    @staticmethod
    def calculate_quality_metrics(df: pd.DataFrame) -> dict:
        """Calculate objective data-quality metrics for a DataFrame."""

        total_rows = len(df)
        total_columns = len(df.columns)
        total_cells = total_rows * total_columns

        missing_cells = int(df.isna().sum().sum())
        missing_percentage = (
            (missing_cells / total_cells) * 100
            if total_cells > 0
            else 0.0
        )

        duplicate_rows = int(df.duplicated(keep="first").sum())
        duplicate_percentage = (
            (duplicate_rows / total_rows) * 100
            if total_rows > 0
            else 0.0
        )

        complete_rows = int(df.notna().all(axis=1).sum())
        complete_row_percentage = (
            (complete_rows / total_rows) * 100
            if total_rows > 0
            else 0.0
        )

        numeric_columns = int(
            df.select_dtypes(include="number").shape[1]
        )
        datetime_columns = int(
            df.select_dtypes(include="datetime").shape[1]
        )
        boolean_columns = int(
            df.select_dtypes(include="bool").shape[1]
        )
        categorical_columns = int(
            df.select_dtypes(
                include=["object", "string", "category"]
            ).shape[1]
        )

        return {
            "total_rows": total_rows,
            "total_columns": total_columns,
            "total_cells": total_cells,
            "missing_cells": missing_cells,
            "missing_percentage": round(missing_percentage, 2),
            "duplicate_rows": duplicate_rows,
            "duplicate_percentage": round(duplicate_percentage, 2),
            "complete_rows": complete_rows,
            "complete_row_percentage": round(
                complete_row_percentage, 2
            ),
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "datetime_columns": datetime_columns,
            "boolean_columns": boolean_columns,
        }
