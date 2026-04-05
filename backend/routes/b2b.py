from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
import time
from core.logger import logger

router = APIRouter(tags=["b2b"])

class MicroChargeRequest(BaseModel):
    b2b_api_key: str = Field(..., description="API Key provided to partner platforms (e.g., Blinkit)")
    partner_id: str = Field(..., description="ID of the platform.")
    zone_id: str = Field(..., description="Delivery Zone ID")
    order_amount: float = Field(..., description="Total cart value in INR")

class MicroChargeResponse(BaseModel):
    success: bool
    message: str
    surcharge_applied: float
    risk_tier: str
    policy_reference: str

# Mock dynamic pricing engine based on order amount and zone
def calculate_dynamic_surcharge(zone_id: str, order_amount: float) -> tuple[float, str]:
    # Mock logic that would typically ping weather/AQI APIs to surge price
    base_fee = 1.50
    risk_factor = 1.0
    risk_tier = "Low"

    # Example: Certain zones are currently in high disruption (mocked)
    if "Andheri" in zone_id or "Koramangala" in zone_id:
        risk_factor = 2.5
        risk_tier = "High (Rain/Flood Risk)"
    elif "Delhi" in zone_id:
        risk_factor = 3.0
        risk_tier = "Critical (AQI > 400)"

    # Base pricing scales slightly with order value, capped at INR 5
    if order_amount > 500:
        base_fee += 1.0
    elif order_amount > 1000:
        base_fee += 2.0
    
    final_surcharge = round(min(base_fee * risk_factor, 5.0), 2)
    return final_surcharge, risk_tier


@router.post("/b2b/micro-charge", response_model=MicroChargeResponse, summary="Automated Surcharge calculation for Partners")
async def create_micro_charge(payload: MicroChargeRequest):
    """
    Called by B2B delivery partners (e.g., Blinkit, Zepto) at checkout.
    Calculates a dynamic risk-adjusted micro-surcharge based on live data
    and generates a parametric policy session for the driver.
    """
    logger.info(f"B2B Micro-charge requested for {payload.partner_id} in {payload.zone_id}")

    # Validate rudimentary mock API key
    if payload.b2b_api_key != "sk_test_b2b_gigshield_123":
        logger.warning("Invalid B2B API key provided")
        raise HTTPException(status_code=401, detail="Invalid API Key")

    surcharge, risk_tier = calculate_dynamic_surcharge(payload.zone_id, payload.order_amount)
    
    # Generate mock policy active reference
    policy_ref = f"POL-{int(time.time())}-{payload.partner_id[:3].upper()}"

    # In production: save to database to pool funds into the Reinsurance pool
    
    return MicroChargeResponse(
        success=True,
        message="Surcharge calculated and policy staged.",
        surcharge_applied=surcharge,
        risk_tier=risk_tier,
        policy_reference=policy_ref
    )
