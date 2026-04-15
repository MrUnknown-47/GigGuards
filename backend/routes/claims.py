from fastapi import APIRouter, HTTPException
from models.schemas import ClaimCreate, Claim, TriggerSimulationRequest, TriggerSimulationResponse
from models.database import db
from services.fraud_detector import fraud_detector
from services.trigger_engine import trigger_engine
from services.ml_models import predict_income_loss, detect_fraud
from core.logger import logger
import uuid

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/", response_model=Claim, summary="Submit Claim", description="Registers a new parametric claim.")
async def submit_claim(claim: ClaimCreate):
    logger.info(f"Processing new claim for policy {claim.policy_id}")
    policy_data = db.get_policy(claim.policy_id)
    if not policy_data:
        logger.warning(f"Policy {claim.policy_id} not found.")
        raise HTTPException(status_code=404, detail="Policy not found")
        
    claim_id = str(uuid.uuid4())
    claim_dict = claim.dict()
    
    fraud_result = fraud_detector.detect_fraud(claim_dict)
    fraud_prob = fraud_result["fraud_score"]
    trigger_met = trigger_engine.evaluate_trigger(policy_data, claim_dict)
    
    is_approved = fraud_prob < 0.2 and trigger_met
    
    new_claim = Claim(
        id=claim_id,
        status="approved" if is_approved else ("investigating" if fraud_prob >= 0.2 else "denied"),
        fraud_probability=fraud_prob,
        payout_approved=is_approved,
        **claim_dict
    )
    db.add_claim(claim_id, new_claim.dict())
    
    logger.info(f"Claim {claim_id} processed with status {new_claim.status}")
    return new_claim

@router.post("/trigger", response_model=TriggerSimulationResponse, summary="Simulate Trigger", description="Run a parametric trigger simulation based on incoming live data.")
async def simulate_trigger(request: TriggerSimulationRequest):
    logger.info(f"Trigger simulation requested with payload: {request.dict()}")
    
    # 3. Minimum Trigger Threshold
    if request.rainfall <= 60.0 and request.aqi <= 400.0:
        logger.info("Trigger conditions not met. Rainfall <= 60 and AQI <= 400.")
        return TriggerSimulationResponse(
            status="denied",
            original_loss=0.0,
            deductible=0.0,
            final_payout=0.0,
            cap_applied=False,
            fraud_check={"level": "low"},
            trust_score=85,
            reason="Trigger conditions not met (Rainfall <= 60 and AQI <= 400)"
        )

    base_daily_income = 1200 
    base_orders_today = 50
    base_hours_worked = 10
    
    estimated_loss = predict_income_loss(
        daily_income=request.daily_income,
        orders_today=base_orders_today,
        hours_worked=base_hours_worked,
        rainfall=request.rainfall,
        aqi=request.aqi,
        traffic=request.traffic,
        city=1
    )
    
    # Run full comprehensive fraud engine
    simulated_claim_data = {
        "amount_requested": estimated_loss,
        "recent_claims_count": 1,
        "gps_jump_km": 10,
        "weather_match": 1,
        "device_motion": 1,
        "session_hours": 5,
        "calculated_speed": 40.0,
        "worker_history": {
            "past_fraud_flags": 0,
            "clean_history_count": 5
        }
    }
    fraud_result = fraud_detector.detect_fraud(simulated_claim_data)
    fraud_level = fraud_result["level"]
    trust_score = fraud_result.get("trust_evaluation", {}).get("trust_score", 85)
    
    if fraud_result["fraud_score"] >= 0.3:
        logger.warning("Trigger simulation flagged for potential fraud.")
        return TriggerSimulationResponse(
            status="fraud_flagged",
            original_loss=round(estimated_loss, 2),
            deductible=0.0,
            final_payout=0.0,
            cap_applied=False,
            fraud_check={"level": fraud_level},
            trust_score=trust_score,
            reason="Suspicious activity detected"
        )
        
    original_loss = round(estimated_loss, 2)
    if original_loss > 0:
        # 2. Deductible logic
        deductible = 100.0
        loss_after_deductible = max(0.0, original_loss - deductible)
        
        # 1. Coverage Cap logic
        cap_applied = False
        if loss_after_deductible > 1000.0:
            final_payout = 1000.0
            cap_applied = True
        else:
            final_payout = loss_after_deductible
            
        logger.info(f"Trigger simulation approved final payout of {final_payout}")
        
        reason_msg = "Heavy rainfall detected" if request.rainfall > 60.0 else "High AQI disruption detected"
        
        return TriggerSimulationResponse(
            status="approved",
            original_loss=original_loss,
            deductible=deductible,
            final_payout=round(final_payout, 2),
            cap_applied=cap_applied,
            fraud_check={"level": fraud_level},
            trust_score=trust_score,
            reason=reason_msg
        )
        
    logger.info("Estimated loss is not greater than 0.")
    return TriggerSimulationResponse(
        status="denied",
        original_loss=0.0,
        deductible=100.0,
        final_payout=0.0,
        cap_applied=False,
        fraud_check={"level": fraud_level},
        trust_score=trust_score,
        reason="No estimated loss"
    )

@router.get("/{claim_id}", response_model=Claim, summary="Get Claim", description="Retrieves an existing claim by ID.")
async def get_claim(claim_id: str):
    logger.info(f"Fetching claim {claim_id}")
    claim_data = db.get_claim(claim_id)
    if not claim_data:
        raise HTTPException(status_code=404, detail="Claim not found")
    return Claim(**claim_data)

from pydantic import BaseModel

class EvidenceRequest(BaseModel):
    claim_id: str
    zone_id: str
    disruption_type: str
    image_url: str

class EvidenceResponse(BaseModel):
    is_authentic: bool
    confidence_score: float
    explanation: str

@router.post("/verify-evidence", response_model=EvidenceResponse, summary="Agentic Vision Verification", description="Verifies claim evidence image via GenAI")
async def verify_evidence(request: EvidenceRequest):
    from services.vision_agent import mock_vision_evaluate_evidence
    logger.info(f"Received evidence verification request for claim {request.claim_id}")
    result = mock_vision_evaluate_evidence(
        claim_id=request.claim_id,
        zone_id=request.zone_id,
        disruption_type=request.disruption_type,
        image_url=request.image_url
    )
    # mock update claim status in db based on result
    status = "approved" if result["is_authentic"] else "denied"
    # we would update db.update_claim(claim_id, status=status)
    return EvidenceResponse(
        is_authentic=result["is_authentic"],
        confidence_score=result["confidence_score"],
        explanation=result["explanation"]
    )