from datetime import datetime, timezone
from typing import Any

import pandas as pd


class ReportService:

    @staticmethod
    def generate_report(
        df: pd.DataFrame,
        quality_metrics: dict | None = None,
        dataset_summary: dict | None = None,
        dashboard_stats: dict | None = None,
    ) -> dict[str, Any]:
        """
        Generate a structured analytics report.

        Existing calculated results can be supplied to avoid
        recalculating them.
        """

        return {
            "generated_at": datetime.now(
                timezone.utc
            ).isoformat(),
            "dataset": {
                "rows": len(df),
                "columns": len(df.columns),
            },
            "quality_metrics": quality_metrics or {},
            "dataset_summary": dataset_summary or {},
            "dashboard_stats": dashboard_stats or {},
        }
