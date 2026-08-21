import pandas as pd

from app.services.analytics.quality_service import QualityService


class DashboardService:

    @staticmethod
    def generate_dashboard_stats(df: pd.DataFrame) -> dict:
        """Generate high-level statistics for the dashboard."""

        quality = QualityService.calculate_quality_metrics(df)

        return {
            "total_rows": quality["total_rows"],
            "total_columns": quality["total_columns"],
            "missing_cells": quality["missing_cells"],
            "missing_percentage": quality["missing_percentage"],
            "duplicate_rows": quality["duplicate_rows"],
            "duplicate_percentage": quality["duplicate_percentage"],
            "complete_row_percentage": quality[
                "complete_row_percentage"
            ],
            "numeric_columns": quality["numeric_columns"],
            "categorical_columns": quality[
                "categorical_columns"
            ],
            "datetime_columns": quality["datetime_columns"],
            "boolean_columns": quality["boolean_columns"],
        }
