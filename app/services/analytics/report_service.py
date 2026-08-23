from datetime import datetime, timezone
from typing import Any

import pandas as pd

from app.services.analytics.quality_service import (
    QualityService,
)
from app.services.analytics.summary_service import (
    SummaryService,
)
from app.services.analytics.dashboard_service import (
    DashboardService,
)


class ReportService:

    @staticmethod
    def generate_report(
        df: pd.DataFrame,
        quality_metrics: dict | None = None,
        dataset_summary: dict | None = None,
        dashboard_stats: dict | None = None,
    ) -> dict[str, Any]:
        """
        Generate a complete analytics report.

        If quality metrics, dataset summary, or dashboard
        statistics are provided, they are reused.

        Otherwise, they are calculated automatically.
        """

        # --------------------------------
        # Quality metrics
        # --------------------------------

        if quality_metrics is None:

            quality_metrics = (
                QualityService.calculate_quality_metrics(
                    df
                )
            )

        # --------------------------------
        # Dataset summary
        # --------------------------------

        if dataset_summary is None:

            dataset_summary = (
                SummaryService.generate_dataset_summary(
                    df
                )
            )

        # --------------------------------
        # Dashboard statistics
        # --------------------------------

        if dashboard_stats is None:

            dashboard_stats = (
                DashboardService.generate_dashboard_stats(
                    df
                )
            )

        # --------------------------------
        # Final report
        # --------------------------------

        return {
            "generated_at": datetime.now(
                timezone.utc
            ).isoformat(),

            "dataset": {
                "rows": len(df),
                "columns": len(df.columns),
            },

            "quality_metrics": quality_metrics,

            "dataset_summary": dataset_summary,

            "dashboard_stats": dashboard_stats,
        }