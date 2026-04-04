import joblib
import os
import numpy as np

class FraudDetector:
    def __init__(self):
        self.model_path = "models/fraud_model.pkl"
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            else:
                self.model = None
                print("Warning: Fraud model not found. Using dummy logic.")
        except Exception as e:
            print(f"Error loading fraud model: {e}")
            self.model = None

    def detect_fraud(self, claim_data: dict) -> float:
        """Returns probability of fraud from 0.0 to 1.0"""
        if self.model:
            features = np.array([[claim_data.get("amount_requested", 0)]])
            return float(self.model.decision_function(features)[0][1])
            
        # Dummy logic: amounts > 5000 have higher fraud probability
        amount = claim_data.get("amount_requested", 0)
        return min(0.99, amount / 10000.0)

fraud_detector = FraudDetector()