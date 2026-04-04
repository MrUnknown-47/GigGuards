import os
import joblib
import numpy as np

# Define paths to the models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

RISK_MODEL_PATH = os.path.join(MODELS_DIR, "risk_model.pkl")
INCOME_MODEL_PATH = os.path.join(MODELS_DIR, "income_model.pkl")
FRAUD_MODEL_PATH = os.path.join(MODELS_DIR, "fraud_model.pkl")

# Load models globally so they are cached in memory when the FastAPI app starts
def load_model(path: str):
    if os.path.exists(path):
        try:
            return joblib.load(path)
        except Exception as e:
            print(f"Error loading model at {path}: {e}")
            return None
    else:
        print(f"Warning: Model not found at {path}. Using fallback logic.")
        return None

risk_model = load_model(RISK_MODEL_PATH)
income_model = load_model(INCOME_MODEL_PATH)
fraud_model = load_model(FRAUD_MODEL_PATH)


def calculate_risk(rainfall: float, aqi: float, temperature: float, accidents: int) -> float:
    """
    Predicts disruption risk based on environmental and incident factors.
    Returns a probability float between 0.0 and 1.0.
    """
    if risk_model:
        # Reshape data into a 2D array for scikit-learn
        features = np.array([[rainfall, aqi, temperature, accidents]])
        # Assuming the model is a classifier returning probabilities
        return float(risk_model.predict_proba(features)[0][1])
    
    # Fallback dummy logic if model is missing
    risk_score = (rainfall / 100.0) + (aqi / 500.0) + (accidents * 0.1)
    return min(0.99, float(risk_score))


def predict_income_loss(daily_income: float, orders_today: int, hours_worked: int, rainfall: float, aqi: float, traffic: float, city: int) -> float:
    """
    Predicts financial income loss for gig workers based on their earning capacity and external factors.
    Returns the predicted lost income as a float.
    """
    if income_model:
        # Reshape data into a 2D array for scikit-learn
        features = np.array([[daily_income, orders_today, hours_worked, rainfall, aqi, traffic, city]])
        # Assuming the model is a regressor returning a continuous value
        return float(income_model.predict(features)[0])
    
    # Fallback dummy logic if model is missing
    loss_factor = min(1.0, (rainfall / 200.0) + (aqi / 1000.0) + (traffic / 100.0))
    return float(daily_income * loss_factor)


def detect_fraud(claim_frequency: int, gps_jump: float, weather_match: float) -> float:
    """
    Detects potentially fraudulent claims by analyzing historical and real-time metadata.
    Returns a probability float between 0.0 and 1.0.
    """
    if fraud_model:
        # Reshape data into a 2D array for scikit-learn
        features = np.array([[claim_frequency, gps_jump, weather_match, 0, 1, 1200]])
        # Assuming the model is a classifier returning probabilities
        return float(fraud_model.decision_function(features)[0])
    
    # Fallback dummy logic if model is missing
    # Lower weather_match means higher fraud probability
    fraud_score = (claim_frequency * 0.15) + (gps_jump / 50.0) + (1.0 - weather_match)
    return min(0.99, float(fraud_score))
