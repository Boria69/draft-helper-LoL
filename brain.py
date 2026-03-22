"""
League of Legends Draft Prediction Model Trainer

Trains a Random Forest classifier on match data to predict draft outcomes.
"""

import logging
import pickle
from pathlib import Path
from datetime import datetime
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# =============================================================================
# CONFIGURATION
# =============================================================================

DATASET_PATH = "ml_dataset.csv"
TARGET_COLUMN = "Target_Blue_Win"
TEST_SIZE = 0.2
RANDOM_STATE = 42
N_ESTIMATORS = 100
MIN_MATCHES = 50  # Minimum for meaningful training

# =============================================================================
# LOGGING SETUP
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('brain.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# =============================================================================
# DATA LOADING & VALIDATION
# =============================================================================

def load_and_validate_data() -> pd.DataFrame:
    """
    Load dataset with validation.

    Returns:
        pd.DataFrame: The loaded match data.

    Raises:
        FileNotFoundError: If dataset file doesn't exist.
        ValueError: If dataset is empty or missing target column.
    """
    if not Path(DATASET_PATH).exists():
        raise FileNotFoundError(f"{DATASET_PATH} not found - run harvester.py first")

    df = pd.read_csv(DATASET_PATH)

    if df.empty:
        raise ValueError("Dataset is empty - harvester returned no data")

    if len(df) < MIN_MATCHES:
        logger.warning(f"Only {len(df)} matches (min: {MIN_MATCHES}). Model will be unreliable.")

    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Missing target column: {TARGET_COLUMN}")

    logger.info(f"Loaded {len(df)} matches from {DATASET_PATH}")
    return df

# =============================================================================
# MODEL TRAINING
# =============================================================================

def train_model(X: pd.DataFrame, y: pd.Series) -> RandomForestClassifier:
    """
    Create and configure Random Forest classifier with cross-validation.

    Args:
        X: Feature matrix (champion compositions)
        y: Target variable (match winner)

    Returns:
        RandomForestClassifier: Configured model (not yet fitted)
    """
    model = RandomForestClassifier(
        n_estimators=N_ESTIMATORS,
        random_state=RANDOM_STATE,
        n_jobs=-1
    )

    # Cross-validation for robust evaluation
    cv_scores = cross_val_score(model, X, y, cv=5)
    logger.info(f"Cross-validation: {cv_scores.mean():.3f} (+/- {cv_scores.std():.3f})")

    return model

# =============================================================================
# MODEL EVALUATION
# =============================================================================

def evaluate_model(model, X_test, y_test):
    """
    Log multiple evaluation metrics for comprehensive assessment.

    Why multiple metrics?
    - Accuracy: Overall correctness
    - Precision: How many predicted wins were actual wins
    - Recall: How many actual wins were correctly predicted
    - F1 Score: Harmonic mean of precision/recall
    - ROC-AUC: Model's ability to distinguish between classes
    """
    predictions = model.predict(X_test)

    logger.info(f"Accuracy:  {accuracy_score(y_test, predictions):.3f}")
    logger.info(f"Precision: {precision_score(y_test, predictions):.3f}")
    logger.info(f"Recall:    {recall_score(y_test, predictions):.3f}")
    logger.info(f"F1 Score:  {f1_score(y_test, predictions):.3f}")
    logger.info(f"ROC-AUC:   {roc_auc_score(y_test, predictions):.3f}")

# =============================================================================
# MODEL PERSISTENCE
# =============================================================================

def save_model(model, columns: list):
    """
    Save model with timestamp for versioning.

    Why timestamped filenames?
    - Track model improvements over time
    - Can rollback to previous versions
    - Compare different model versions
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    model_path = f"models/draft_model_{timestamp}.pkl"
    columns_path = f"models/model_columns_{timestamp}.pkl"

    # Create models directory if it doesn't exist
    Path("models").mkdir(exist_ok=True)

    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    with open(columns_path, "wb") as f:
        pickle.dump(columns, f)

    logger.info(f"Saved: {model_path}, {columns_path}")

# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================

def main():
    """
    Execute the full model training workflow.
    """
    logger.info("=== Draft Model Training ===")

    # Load and validate data
    try:
        df = load_and_validate_data()
    except (FileNotFoundError, ValueError) as e:
        logger.error(f"Data loading failed: {e}")
        return

    # Prepare features and target
    X = df.drop(TARGET_COLUMN, axis=1)
    y = df[TARGET_COLUMN]

    logger.info(f"Features: {X.shape[1]} columns, Samples: {X.shape[0]}")

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    logger.info(f"Train: {len(X_train)} matches, Test: {len(X_test)} matches")

    # Train model
    model = train_model(X, y)
    logger.info("Training Random Forest...")
    model.fit(X_train, y_train)

    # Evaluate
    logger.info("Evaluating model on test data...")
    evaluate_model(model, X_test, y_test)

    # Save
    save_model(model, list(X.columns))

    logger.info("Training complete!")

if __name__ == "__main__":
    main()
