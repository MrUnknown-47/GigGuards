import time
import random
from core.logger import logger

def mock_vision_evaluate_evidence(claim_id: str, zone_id: str, disruption_type: str, image_url: str) -> dict:
    """
    Mocks an Agentic GenAI model evaluating an image from a delivery driver
    to verify a parametric claim (e.g., looking for a flooded road or closed shop).
    In production, this would call GPT-4o or Gemini 1.5 Pro.
    """
    logger.info(f"Agentic Vision Model analyzing claim {claim_id} for {disruption_type}...")
    
    # Simulate API latency for GenAI call
    time.sleep(1.5)
    
    # Mock analysis result
    confidence_score = round(random.uniform(0.75, 0.99), 2)
    is_authentic = confidence_score > 0.8
    
    if disruption_type == "RAIN":
        explanation = "Image shows significant waterlogging on public roads matching GPS coordinate profiles."
    elif disruption_type == "AQI":
        explanation = "Image shows severe smog reducing visibility to less than 100 meters."
    else:
        explanation = "Visual evidence is consistent with reported disruption."
        
    if not is_authentic:
        explanation = "Image does not provide clear evidence of the reported disruption or appears to be taken indoors."
        
    return {
        "is_authentic": is_authentic,
        "confidence_score": confidence_score,
        "explanation": explanation,
        "agent_timestamp": time.time()
    }
