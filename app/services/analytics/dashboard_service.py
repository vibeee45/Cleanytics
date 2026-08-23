import pandas as pd

from app.services.analytics.quality_service import QualityService


class DashboardService:

    @staticmethod
    def generate_dashboard_stats(
        df: pd.DataFrame,
    ) -> dict:
        """
        Generate compact statistics for the
        Cleanytics dashboard.

        These statistics are intended for:
        - Dashboard cards
        - Summary widgets
        - Charts
        - Quick dataset overview
        """

        quality = (
            QualityService.calculate_quality_metrics(df)
        )

        # --------------------------------
        # Dataset size
        # --------------------------------

        dataset_size = {
            "rows": quality["total_rows"],
            "columns": quality["total_columns"],
            "cells": quality["total_cells"],
        }

        # --------------------------------
        # Data quality
        # --------------------------------

        data_quality = {
            "missing_cells": quality[
                "missing_cells"
            ],
            "missing_percentage": quality[
                "missing_percentage"
            ],
            "duplicate_rows": quality[
                "duplicate_rows"
            ],
            "duplicate_percentage": quality[
                "duplicate_percentage"
            ],
            "complete_rows": quality[
                "complete_rows"
            ],
            "complete_row_percentage": quality[
                "complete_row_percentage"
            ],
        }

        # --------------------------------
        # Column type distribution
        # --------------------------------

        column_types = {
            "numeric": quality[
                "numeric_columns"
            ],
            "categorical": quality[
                "categorical_columns"
            ],
            "datetime": quality[
                "datetime_columns"
            ],
            "boolean": quality[
                "boolean_columns"
            ],
        }

        # --------------------------------
        # Dashboard response
        # --------------------------------

        return {
            "dataset_size": dataset_size,
            "data_quality": data_quality,
            "column_types": column_types,
        }