import joblib
import os
import numpy as np
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two lat/lon coordinates in kilometers."""
    R = 6371.0 # Earth radius
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

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

    def evaluate_trust(self, worker_history: dict) -> dict:
        """
        Calculates the Gig Worker Trust Score (0-100).
        Base score: 80
        Each fraud flag: -20
        Consistent clean history step: +5
        """
        trust_score = 80
        
        past_fraud_flags = worker_history.get("past_fraud_flags", 0)
        clean_history = worker_history.get("clean_history_count", 0)
        
        trust_score -= (past_fraud_flags * 20)
        trust_score += (clean_history * 5)
        
        trust_score = max(0, min(100, trust_score))
        
        if trust_score >= 80:
            level = "high trust"
        elif trust_score >= 50:
            level = "normal"
        else:
            level = "low trust"
            
        return {
            "trust_score": trust_score,
            "level": level
        }

    def detect_fraud(self, claim_data: dict) -> dict:
        """
        Runs ML isolation forest alongside rule-based heuristics.
        Returns structured dictionary.
        """
        # 1. Base ML model risk 
        if self.model:
            features = np.array([[
                claim_data.get("claim_frequency", 0),
                claim_data.get("gps_jump_km", 0),
                claim_data.get("weather_match", 1),
                claim_data.get("device_motion", 1),
                claim_data.get("session_hours", 5),
                claim_data.get("amount_requested", 500)
    ]])

            ml_score = float(self.model.decision_function(features)[0])
        else:
            amount = claim_data.get("amount_requested", 0)
            ml_score = min(0.99, amount / 10000.0)

        fraud_score = ml_score
        reasons = []

        if ml_score > 0.5:
            reasons.append("ml_anomaly")

        # 2. Rule based heuristics
        
        # Speed check
        speed = claim_data.get("calculated_speed", 0.0)
        if speed > 120.0:
            fraud_score += 0.3
            reasons.append("high_speed")

        # Claim frequency check
        recent_claims = claim_data.get("recent_claims_count", 0)
        if recent_claims > 5:
            fraud_score += 0.2
            reasons.append("high_claim_frequency")
            
        # IP vs GPS mismatch
        ip_lat = claim_data.get("ip_lat", None)
        ip_lon = claim_data.get("ip_lon", None)
        gps_lat = claim_data.get("gps_lat", None)
        gps_lon = claim_data.get("gps_lon", None)
        
        if all(v is not None for v in [ip_lat, ip_lon, gps_lat, gps_lon]):
            dist = haversine_distance(ip_lat, ip_lon, gps_lat, gps_lon)
            if dist > 100.0:
                fraud_score += 0.3
                reasons.append("location_mismatch")
                
        # 3. Trust Score Integration
        worker_history = claim_data.get("worker_history", {})
        trust_evaluation = self.evaluate_trust(worker_history)
        
        if trust_evaluation["level"] == "low trust":
            fraud_score += 0.2
            reasons.append("low_trust_score")
                
        # Normalize score
        fraud_score = min(1.0, fraud_score)
        
        # Determine risk level
        if fraud_score >= 0.7:
            level = "high"
        elif fraud_score >= 0.3:
            level = "medium"
        else:
            level = "low"
            
        return {
            "fraud_score": round(fraud_score, 2),
            "level": level,
            "reasons": reasons,
            "trust_evaluation": trust_evaluation
        }

fraud_detector = FraudDetector()