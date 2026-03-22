"""
Match Data Translator for ML Training

Converts raw match data from SQLite database into one-hot encoded CSV format
suitable for machine learning model training.

Input: dataset.db (SQLite database with matches table)
Output: ml_dataset.csv (one-hot encoded champion features + target variable)
"""

import logging
from pathlib import Path
import sqlite3
import pandas as pd

# =============================================================================
# CONFIGURATION
# =============================================================================

DATABASE_PATH = "dataset.db"
OUTPUT_CSV = "ml_dataset.csv"
TARGET_COLUMN = "Target_Blue_Win"

# =============================================================================
# LOGGING SETUP
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('translator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# =============================================================================
# DATA LOADING & VALIDATION
# =============================================================================

def load_database() -> pd.DataFrame:
    """
    Load match data from SQLite database.

    Returns:
        pd.DataFrame: Raw match data from database.

    Raises:
        FileNotFoundError: If database file doesn't exist.
        ValueError: If matches table is empty.
    """
    if not Path(DATABASE_PATH).exists():
        raise FileNotFoundError(
            f"{DATABASE_PATH} not found - run harvester.py first"
        )

    conn = sqlite3.connect(DATABASE_PATH)

    try:
        df = pd.read_sql_query("SELECT * FROM matches", conn)

        if df.empty:
            raise ValueError("No matches in database - run harvester.py first")

        logger.info(f"Loaded {len(df)} matches from {DATABASE_PATH}")
        return df

    finally:
        conn.close()

# =============================================================================
# ONE-HOT ENCODING
# =============================================================================

def encode_match_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Convert comma-separated champion strings into one-hot encoded columns.

    Input format:
        blue_team: "Aatrox_TOP,JarvanIV_JUNG,Azir_MID,..."
        red_team: "Renekton_TOP,Graves_JUNG,Azir_MID,..."
        winner: "Blue" or "Red"

    Output format:
        Blue_Atrox_TOP | Blue_JarvanIV_JUNG | Red_Renekton_TOP | ... | Target_Blue_Win
              1        |          1         |        1         | ... |       1

    Args:
        df: DataFrame with blue_team, red_team, winner columns

    Returns:
        DataFrame with one-hot encoded champion features
    """
    encoded_rows = []

    # Validate winner column
    valid_winners = {'Blue', 'Red'}
    actual_winners = set(df['winner'].unique())
    if not actual_winners.issubset(valid_winners):
        invalid = actual_winners - valid_winners
        raise ValueError(f"Invalid winner values: {invalid}")

    for idx, row in df.iterrows():
        # Parse champion lists
        blue_champs = row['blue_team'].split(',') if row['blue_team'] else []
        red_champs = row['red_team'].split(',') if row['red_team'] else []

        # Build feature dict
        match_features = {
            TARGET_COLUMN: 1 if row['winner'] == 'Blue' else 0
        }

        # Set champion indicators
        for champ in blue_champs:
            if champ:  # Skip empty strings
                match_features[f"Blue_{champ}"] = 1

        for champ in red_champs:
            if champ:  # Skip empty strings
                match_features[f"Red_{champ}"] = 1

        encoded_rows.append(match_features)

    logger.info(f"Encoded {len(encoded_rows)} matches")
    return pd.DataFrame(encoded_rows)

def finalize_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Fill missing values and ensure correct data types.

    Args:
        df: One-hot encoded DataFrame with NaN values

    Returns:
        DataFrame with all NaN filled as 0 and int dtypes
    """
    # Fill NaN (champions not present in match) with 0
    df = df.fillna(0)

    # Convert to integers (1/0 not 1.0/0.0)
    df = df.astype(int)

    return df

# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================

def main():
    """
    Execute the full data translation workflow.
    """
    logger.info("=== Match Data Translation ===")

    # Load raw data
    try:
        df = load_database()
    except (FileNotFoundError, ValueError) as e:
        logger.error(f"Data loading failed: {e}")
        return

    # Encode to ML format
    logger.info("Converting to one-hot encoded format...")
    ml_df = encode_match_data(df)

    # Finalize (fill NaN, convert types)
    ml_df = finalize_dataset(ml_df)

    # Show dataset info
    logger.info(f"Dataset shape: {ml_df.shape[0]} rows × {ml_df.shape[1]} columns")
    logger.info(f"Target distribution: Blue wins={ml_df[TARGET_COLUMN].sum()}, Red wins={len(ml_df) - ml_df[TARGET_COLUMN].sum()}")

    # Preview first few rows
    preview_cols = list(ml_df.columns)[:6]
    logger.info(f"Preview:\n{ml_df[preview_cols].head()}")

    # Save to CSV
    ml_df.to_csv(OUTPUT_CSV, index=False)
    logger.info(f"Saved: {OUTPUT_CSV}")

    # Memory usage info
    memory_mb = ml_df.memory_usage(deep=True).sum() / (1024 * 1024)
    logger.info(f"Memory usage: {memory_mb:.2f} MB")

if __name__ == "__main__":
    main()
