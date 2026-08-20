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
        - >25%       -> Fill with mean + warning

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

            missing_percentage = (missing_count / total_rows) * 100

            # Numeric column
            if pd.api.types.is_numeric_dtype(cleaned_df[column]):

                if missing_percentage <= 5:
                    cleaned_df = cleaned_df.dropna(subset=[column])

                    strategy = "drop"

                elif missing_percentage <= 15:
                    mode = cleaned_df[column].mode()

                    if not mode.empty:
                        cleaned_df[column] = cleaned_df[column].fillna(
                            mode.iloc[0]
                        )
                        strategy = "mode"
                    else:
                        cleaned_df = cleaned_df.dropna(subset=[column])
                        strategy = "drop"

                else:
                    mean = cleaned_df[column].mean()

                    cleaned_df[column] = cleaned_df[column].fillna(mean)

                    strategy = "mean"

                cleaning_report.append(
                    {
                        "column": column,
                        "data_type": "numeric",
                        "missing_count": int(missing_count),
                        "missing_percentage": round(
                            missing_percentage, 2
                        ),
                        "strategy": strategy,
                    }
                )

            # String / categorical / unknown column
            else:

                cleaned_df[column] = cleaned_df[column].fillna("Not Known")

                cleaning_report.append(
                    {
                        "column": column,
                        "data_type": "categorical",
                        "missing_count": int(missing_count),
                        "missing_percentage": round(
                            missing_percentage, 2
                        ),
                        "strategy": "Not Known",
                    }
                )

        return cleaned_df, cleaning_report