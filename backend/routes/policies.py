from fastapi import APIRouter, HTTPException
from models.schemas import PolicyCreate, Policy, PremiumResponse
from models.database import db
from services.ml_models import calculate_risk
from core.logger import logger
import uuid
from datetime import datetime

router = APIRouter(prefix="/policies", tags=["policies"])

@router.post("/", response_model=Policy, summary="Issue New Policy", description="Creates and activates a new protection policy for a worker.")
async def create_policy(policy: PolicyCreate):
    logger.info(f"Issuing new policy for worker {policy.worker_id}")
    if not db.get_worker(policy.worker_id):
        logger.warning(f"Failed policy issuance: Worker {policy.worker_id} not found.")
        raise HTTPException(status_code=404, detail="Worker not found")
        
    policy_id = str(uuid.uuid4())
    new_policy = Policy(
        id=policy_id,
        status="active",
        created_at=datetime.utcnow(),
        **policy.dict()
    )
    db.add_policy(policy_id, new_policy.dict())
    
    logger.info(f"Policy {policy_id} issued successfully.")
    return new_policy

@router.get("/premium", response_model=PremiumResponse, summary="Calculate Live Premium Quotes", description="Dynamically prices a policy using the actuarial ML pipeline.")
async def calculate_premium(rainfall: float, aqi: float, temperature: float, traffic: int):
    logger.info(f"Premium calculation triggered: rain={rainfall}, aqi={aqi}, temp={temperature}, traffic={traffic}")
    
    risk_score = calculate_risk(
        rainfall=rainfall,
        aqi=aqi,
        temperature=temperature,
        accidents=traffic
    )
    
    base = 10.0
    risk_factor = 75.0
    premium = base + (risk_score * risk_factor)
    
    logger.info(f"Yielded risk score {risk_score} resulting in premium of {premium}")
    return PremiumResponse(
        risk_score=round(risk_score, 4),
        weekly_premium=round(premium, 2)
    )

@router.get("/{policy_id}", response_model=Policy, summary="Fetch Specific Policy", description="Fetches the full entity attributes of an issued policy by ID.")
async def get_policy(policy_id: str):
    logger.info(f"Fetching policy metadata for {policy_id}")
    policy_data = db.get_policy(policy_id)
    if not policy_data:
        raise HTTPException(status_code=404, detail="Policy not found")
    return Policy(**policy_data)