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
    
    fraud_prob = fraud_detector.detect_fraud(claim_dict)
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
    base_daily_income = 1200 
    base_orders_today= 50
    base_hours_worked=10
    estimated_loss = predict_income_loss(
        daily_income=request.daily_income,
        orders_today = base_orders_today,
        hours_worked = base_hours_worked,
        rainfall=request.rainfall,
        aqi=request.aqi,
        traffic=request.traffic,
        city=1
    )
    
    fraud_prob = detect_fraud(
        claim_frequency=1,
        gps_jump=5.0, 
        weather_match=1.0 if request.rainfall > 10.0 else 0.5
    )
    
    if fraud_prob >= 0.3:
        logger.warning("Trigger simulation flagged for potential fraud.")
        return TriggerSimulationResponse(
            status="fraud_flagged",
            payout_amount=0.0,
            trigger_reason="Suspicious activity detected"
        )
        
    if estimated_loss > 0:
        logger.info(f"Trigger simulation approved payout of {estimated_loss}")
        return TriggerSimulationResponse(
            status="payout_approved",
            payout_amount=round(estimated_loss, 2),
            trigger_reason="Parametric trigger threshold met"
        )
        
    logger.info("Trigger conditions not met.")
    return TriggerSimulationResponse(
        status="denied",
        payout_amount=0.0,
        trigger_reason="Trigger conditions not met"
    )

@router.get("/{claim_id}", response_model=Claim, summary="Get Claim", description="Retrieves an existing claim by ID.")
async def get_claim(claim_id: str):
    logger.info(f"Fetching claim {claim_id}")
    claim_data = db.get_claim(claim_id)
    if not claim_data:
        raise HTTPException(status_code=404, detail="Claim not found")
    return Claim(**claim_data)