import pandas as pd


class SummaryService:

    @staticmethod
    def generate_dataset_summary(
        df: pd.DataFrame,
    ) -> dict:
        """
        Generate a detailed summary of a dataset.

        General information:
        - rows
        - columns

        Every column:
        - column name
        - data type
        - non-null count
        - missing count
        - unique count

        Numeric columns:
        - min
        - max
        - mean
        - median
        - standard deviation

        Categorical/string columns:
        - top value
        - top value count

        Datetime columns:
        - minimum date
        - maximum date
        """

        columns = []

        for column in df.columns:

            series = df[column]

            column_summary = {
                "column": column,
                "data_type": str(series.dtype),
                "non_null_count": int(
                    series.notna().sum()
                ),
                "missing_count": int(
                    series.isna().sum()
                ),
                "unique_count": int(
                    series.nunique(
                        dropna=True
                    )
                ),
            }

            # --------------------------------
            # Numeric columns
            # --------------------------------

            if pd.api.types.is_numeric_dtype(
                series
            ) and not pd.api.types.is_bool_dtype(
                series
            ):

                numeric_series = series.dropna()

                if not numeric_series.empty:

                    column_summary["statistics"] = {
                        "min": float(
                            numeric_series.min()
                        ),
                        "max": float(
                            numeric_series.max()
                        ),
                        "mean": float(
                            numeric_series.mean()
                        ),
                        "median": float(
                            numeric_series.median()
                        ),
                        "standard_deviation": float(
                            numeric_series.std(
                                ddof=1
                            )
                        )
                        if len(numeric_series) > 1
                        else 0.0,
                    }

                else:

                    column_summary["statistics"] = {
                        "min": None,
                        "max": None,
                        "mean": None,
                        "median": None,
                        "standard_deviation": None,
                    }

            # --------------------------------
            # Datetime columns
            # --------------------------------

            elif pd.api.types.is_datetime64_any_dtype(
                series
            ):

                datetime_series = series.dropna()

                if not datetime_series.empty:

                    column_summary["statistics"] = {
                        "min_date": (
                            datetime_series.min()
                            .isoformat()
                        ),
                        "max_date": (
                            datetime_series.max()
                            .isoformat()
                        ),
                    }

                else:

                    column_summary["statistics"] = {
                        "min_date": None,
                        "max_date": None,
                    }

            # --------------------------------
            # Categorical / string columns
            # --------------------------------

            elif (
                pd.api.types.is_object_dtype(series)
                or pd.api.types.is_string_dtype(series)
                or pd.api.types.is_categorical_dtype(series)
            ):

                value_counts = (
                    series
                    .dropna()
                    .value_counts()
                )

                if not value_counts.empty:

                    top_value = value_counts.index[0]

                    column_summary["statistics"] = {
                        "top_value": str(
                            top_value
                        ),
                        "top_value_count": int(
                            value_counts.iloc[0]
                        ),
                    }

                else:

                    column_summary["statistics"] = {
                        "top_value": None,
                        "top_value_count": 0,
                    }

            # --------------------------------
            # Boolean columns
            # --------------------------------

            elif pd.api.types.is_bool_dtype(
                series
            ):

                value_counts = (
                    series
                    .dropna()
                    .value_counts()
                )

                column_summary["statistics"] = {
                    "true_count": int(
                        value_counts.get(
                            True,
                            0
                        )
                    ),
                    "false_count": int(
                        value_counts.get(
                            False,
                            0
                        )
                    ),
                }

            # --------------------------------
            # Unknown / other types
            # --------------------------------

            else:

                column_summary["statistics"] = {}

            columns.append(column_summary)

        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_details": columns,
        }