import pandas as pd


class CleaningService:

    @staticmethod
    def handle_missing_values(
        df: pd.DataFrame,
    ) -> tuple[pd.DataFrame, list[dict]]:
        """
        Handle missing values according to Cleanytics rules.

        Numeric columns:
        - 0–5%       -> Drop rows containing missing values
        - >5–15%     -> Fill with mode
        - >15–25%    -> Fill with mean
        - >25%       -> Fill with mean

        String/categorical columns:
        - Any missing value -> "Not Known"

        Returns:
            cleaned DataFrame
            cleaning report
        """

        cleaned_df = df.copy()
        cleaning_report = []

        for column in cleaned_df.columns:

            missing_count = cleaned_df[column].isna().sum()

            if missing_count == 0:
                continue

            total_rows = len(cleaned_df)

            if total_rows == 0:
                continue

            missing_percentage = (
                missing_count / total_rows
            ) * 100

            # Numeric column
            if pd.api.types.is_numeric_dtype(
                cleaned_df[column]
            ):

                # 0–5% → Drop affected rows
                if missing_percentage <= 5:

                    cleaned_df = cleaned_df.dropna(
                        subset=[column]
                    )

                    strategy = "drop"

                # >5–15% → Fill with mode
                elif missing_percentage <= 15:

                    mode = cleaned_df[column].mode()

                    if not mode.empty:

                        cleaned_df[column] = (
                            cleaned_df[column].fillna(
                                mode.iloc[0]
                            )
                        )

                        strategy = "mode"

                    else:

                        cleaned_df = cleaned_df.dropna(
                            subset=[column]
                        )

                        strategy = "drop"

                # >15% → Fill with mean
                else:

                    mean = cleaned_df[column].mean()

                    cleaned_df[column] = (
                        cleaned_df[column].fillna(mean)
                    )

                    strategy = "mean"

                cleaning_report.append(
                    {
                        "column": column,
                        "data_type": "numeric",
                        "missing_count": int(
                            missing_count
                        ),
                        "missing_percentage": float(
                            round(
                                missing_percentage,
                                2
                            )
                        ),
                        "strategy": strategy,
                    }
                )

            # String / categorical / unknown column
            else:

                cleaned_df[column] = (
                    cleaned_df[column].fillna(
                        "Not Known"
                    )
                )

                cleaning_report.append(
                    {
                        "column": column,
                        "data_type": "categorical",
                        "missing_count": int(
                            missing_count
                        ),
                        "missing_percentage": float(
                            round(
                                missing_percentage,
                                2
                            )
                        ),
                        "strategy": "Not Known",
                    }
                )

        return cleaned_df, cleaning_report

    @staticmethod
    def remove_duplicates(
        df: pd.DataFrame,
    ) -> tuple[pd.DataFrame, dict]:
        """
        Remove exact duplicate records.

        The first occurrence of a duplicate
        record is kept.

        Returns:
            cleaned DataFrame
            duplicate-removal report
        """

        original_count = len(df)

        duplicate_count = int(
            df.duplicated(
                keep="first"
            ).sum()
        )

        cleaned_df = (
            df.drop_duplicates(
                keep="first"
            )
            .reset_index(drop=True)
        )

        remaining_count = len(cleaned_df)

        duplicate_percentage = (
            (
                duplicate_count
                / original_count
            ) * 100
            if original_count > 0
            else 0.0
        )

        report = {
            "original_rows": original_count,
            "duplicate_rows": duplicate_count,
            "duplicates_removed": duplicate_count,
            "duplicate_percentage": float(
                round(
                    duplicate_percentage,
                    2
                )
            ),
            "remaining_rows": remaining_count,
        }

        return cleaned_df, report

    @staticmethod
    def infer_data_types(
        df: pd.DataFrame,
    ) -> tuple[pd.DataFrame, list[dict]]:
        """
        Infer appropriate data types for
        DataFrame columns.

        Detection order:
        1. Boolean
        2. Numeric
        3. Datetime
        4. String

        Values with leading zeros such as
        '00123' are kept as strings.

        Returns:
            DataFrame with inferred types
            Type-inference report
        """

        cleaned_df = df.copy()
        type_report = []

        for column in cleaned_df.columns:

            original_dtype = str(
                cleaned_df[column].dtype
            )

            # Already boolean
            if pd.api.types.is_bool_dtype(
                cleaned_df[column]
            ):

                inferred_type = "boolean"

            # Already numeric
            elif pd.api.types.is_numeric_dtype(
                cleaned_df[column]
            ):

                inferred_type = "numeric"

            else:

                series = (
                    cleaned_df[column]
                    .dropna()
                )

                # Completely empty column
                if series.empty:

                    inferred_type = "string"

                else:

                    # -------------------------
                    # Boolean detection
                    # -------------------------

                    boolean_values = {
                        "true",
                        "false",
                        "yes",
                        "no",
                    }

                    values_lower = (
                        series.astype(str)
                        .str.strip()
                        .str.lower()
                    )

                    if values_lower.isin(
                        boolean_values
                    ).all():

                        cleaned_df[column] = (
                            cleaned_df[column]
                            .astype(str)
                            .str.strip()
                            .str.lower()
                            .map(
                                {
                                    "true": True,
                                    "false": False,
                                    "yes": True,
                                    "no": False,
                                }
                            )
                        )

                        inferred_type = "boolean"

                    else:

                        # -------------------------
                        # Numeric detection
                        # -------------------------

                        numeric_values = (
                            pd.to_numeric(
                                series,
                                errors="coerce",
                            )
                        )

                        if numeric_values.notna().all():

                            string_values = (
                                series
                                .astype(str)
                                .str.strip()
                            )

                            # Protect values such as:
                            # 00123
                            # 00045

                            has_leading_zero = (
                                string_values
                                .str.match(
                                    r"^0\d+$"
                                )
                                .any()
                            )

                            if has_leading_zero:

                                inferred_type = (
                                    "string"
                                )

                            else:

                                cleaned_df[column] = (
                                    pd.to_numeric(
                                        cleaned_df[
                                            column
                                        ],
                                        errors="coerce",
                                    )
                                )

                                inferred_type = (
                                    "numeric"
                                )

                        else:

                            # -------------------------
                            # Datetime detection
                            # -------------------------

                            datetime_values = (
                                pd.to_datetime(
                                    series,
                                    errors="coerce",
                                    format="mixed",
                                )
                            )

                            if (
                                datetime_values
                                .notna()
                                .all()
                            ):

                                cleaned_df[column] = (
                                    pd.to_datetime(
                                        cleaned_df[
                                            column
                                        ],
                                        errors="coerce",
                                        format="mixed",
                                    )
                                )

                                inferred_type = (
                                    "datetime"
                                )

                            else:

                                # -------------------------
                                # String
                                # -------------------------

                                inferred_type = (
                                    "string"
                                )

            type_report.append(
                {
                    "column": column,
                    "original_dtype": original_dtype,
                    "inferred_type": inferred_type,
                }
            )

        return cleaned_df, type_report