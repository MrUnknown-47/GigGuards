import joblib
import numpy as np
import os

class RiskCalculator:
    def __init__(self):
        self.model_path = "models/risk_model.pkl"
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            else:
                self.model = None
                print("Warning: Risk model not found. Using dummy logic.")
        except Exception as e:
            print(f"Error loading risk model: {e}")
            self.model = None

    def calculate_risk(self, worker_data: dict) -> float:
        """Calculate risk score from 0.0 (low risk) to 1.0 (high risk)"""
        if self.model:
            # Dummy feature extraction
            features = np.array([[
                worker_data.get('experience_years', 0),
                worker_data.get('hourly_rate', 0)
            ]])
            return float(self.model.predict_proba(features)[0][1])
        
        # Dummy logic: less experience = higher risk
        experience = worker_data.get("experience_years", 0)
        base_risk = max(0.1, 1.0 - (experience * 0.1))
        return min(0.99, base_risk)

risk_calculator = RiskCalculator()