import os
import re
import polars as pl
import numpy as np
from typing import Tuple, Dict, Any

class PolarsCleaningEngine:
    """
    High-Performance Data Cleaning Engine powered by Polars (Rust core).
    Executes fast multithreaded transformations and calculates Data Quality Scores.
    """

    @staticmethod
    def inspect_dataset(file_path: str) -> Tuple[int, int, Dict[str, Any], float]:
        """
        Scans raw dataset to generate row/col counts, missing stats, duplicates, and initial quality score.
        """
        df = PolarsCleaningEngine._load_file(file_path)
        row_count = df.height
        col_count = df.width

        # Calculate null count across columns
        null_counts = {}
        total_cells = row_count * col_count if col_count > 0 else 1
        total_nulls = 0

        for col in df.columns:
            n_null = df[col].null_count()
            null_counts[col] = n_null
            total_nulls += n_null

        # Calculate duplicate rows count
        n_duplicates = row_count - df.unique().height

        # Quality Score metric (0 - 100)
        completeness_ratio = (1.0 - (total_nulls / total_cells)) if total_cells > 0 else 1.0
        uniqueness_ratio = (1.0 - (n_duplicates / row_count)) if row_count > 0 else 1.0
        
        quality_score = round(((completeness_ratio * 0.6) + (uniqueness_ratio * 0.4)) * 100, 1)

        summary = {
            "null_counts": null_counts,
            "total_nulls": total_nulls,
            "duplicate_rows": n_duplicates,
            "columns": list(df.columns),
            "dtypes": {col: str(dtype) for col, dtype in zip(df.columns, df.dtypes)}
        }

        return row_count, col_count, summary, quality_score

    @staticmethod
    def clean_dataset(
        file_path: str,
        output_path: str,
        config: Dict[str, Any]
    ) -> Tuple[int, int, Dict[str, Any], float]:
        """
        Executes full cleaning pipeline based on configuration settings.
        """
        df = PolarsCleaningEngine._load_file(file_path)
        initial_rows = df.height

        cleaning_log = []

        # 1. Normalize Column Headers
        if config.get("normalize_headers", True):
            new_columns = [
                re.sub(r'[^a-zA-Z0-9_]', '_', col.strip().lower()).strip('_')
                for col in df.columns
            ]
            df.columns = new_columns
            cleaning_log.append("Normalized column header names")

        # 2. Deduplication
        if config.get("drop_duplicates", True):
            unique_df = df.unique()
            dropped_dups = df.height - unique_df.height
            df = unique_df
            if dropped_dups > 0:
                cleaning_log.append(f"Removed {dropped_dups} duplicate rows")

        # 3. Handle Null Values
        if config.get("fill_missing", True):
            strategy = config.get("impute_strategy", "auto")
            filled_cols = 0
            for col in df.columns:
                dtype = df[col].dtype
                if df[col].null_count() > 0:
                    if dtype in [pl.Float64, pl.Float32, pl.Int64, pl.Int32]:
                        if strategy == "median":
                            fill_val = df[col].median()
                        else:
                            fill_val = df[col].mean()
                        if fill_val is not None:
                            df = df.with_columns(pl.col(col).fill_null(fill_val))
                            filled_cols += 1
                    elif dtype == pl.String or dtype == pl.Utf8:
                        df = df.with_columns(pl.col(col).fill_null("N/A"))
                        filled_cols += 1
            if filled_cols > 0:
                cleaning_log.append(f"Imputed missing values across {filled_cols} columns using strategy '{strategy}'")

        # 4. Save Cleaned Dataset
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        if output_path.endswith(".csv"):
            df.write_csv(output_path)
        elif output_path.endswith(".xlsx"):
            # Fallback export via pandas for excel writing
            df.to_pandas().to_excel(output_path, index=False)
        else:
            df.write_csv(output_path)

        # 5. Compute Final Metrics
        final_rows = df.height
        final_cols = df.width
        
        _, _, summary, final_quality_score = PolarsCleaningEngine.inspect_dataset(output_path)
        summary["cleaning_log"] = cleaning_log
        summary["initial_rows"] = initial_rows

        return final_rows, final_cols, summary, final_quality_score

    @staticmethod
    def _load_file(file_path: str) -> pl.DataFrame:
        if file_path.endswith(".csv"):
            return pl.read_csv(file_path, ignore_errors=True)
        elif file_path.endswith(".xlsx") or file_path.endswith(".xls"):
            import pandas as pd
            pdf = pd.read_excel(file_path)
            return pl.from_pandas(pdf)
        else:
            return pl.read_csv(file_path, ignore_errors=True)
