class ParametricTriggerEngine:
    def __init__(self):
        pass

    def evaluate_trigger(self, policy: dict, claim_data: dict) -> bool:
        """
        Evaluate if a claim meets the parametric trigger conditions.
        """
        coverage_type = policy.get("coverage_type")
        
        # Mock weather API trigger check
        if coverage_type == "weather":
            return True
            
        # Mock income loss trigger check
        elif coverage_type == "income_loss":
             return claim_data.get("amount_requested", 0) <= policy.get("coverage_amount", 0)
             
        # Default fallback
        return False

trigger_engine = ParametricTriggerEngine()