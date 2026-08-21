import pandas as pd


class SummaryService:

    @staticmethod
    def generate_dataset_summary(df: pd.DataFrame) -> dict:
        """Generate a general summary of a dataset."""

        columns = []

        for column in df.columns:
            series = df[column]

            columns.append(
                {
                    "column": column,
                    "data_type": str(series.dtype),
                    "non_null_count": int(series.notna().sum()),
                    "missing_count": int(series.isna().sum()),
                    "unique_count": int(series.nunique(dropna=True)),
                }
            )

        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_details": columns,
        }
