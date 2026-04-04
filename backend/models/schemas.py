from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ---------------------------------------------------------
# Generic Standard Responses
# ---------------------------------------------------------
class ErrorResponse(BaseModel):
    success: bool = Field(default=False, description="Flag indicating business logic failure")
    error_code: str = Field(..., example="VALIDATION_ERROR", description="High-level error classification")
    message: str = Field(..., example="Input payload failed structural validation", description="Human-readable message")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Deep debugging context")

# ---------------------------------------------------------
# Workers
# ---------------------------------------------------------
class WorkerCreate(BaseModel):
    name: str = Field(..., example="Rahul Sharma", description="Full legal name of the gig worker")
    profession: str = Field(..., example="Grocery Delivery", description="Primary trade or platform job")
    location: str = Field(..., example="Mumbai", description="Primary operating city")
    experience_years: int = Field(..., ge=0, example=3, description="Years in the gig economy")
    hourly_rate: float = Field(..., gt=0, example=150.00, description="Average hourly earning potential")

class Worker(WorkerCreate):
    id: str = Field(..., description="Unique UUID for the worker profile")
    risk_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Machine learning calculated baseline risk score")

class VerifiedWorkerResponse(BaseModel):
    name: str = Field(..., example="Rahul Sharma")
    platform: str = Field(..., example="Zepto")
    city: str = Field(..., example="Mumbai")
    daily_income: float = Field(..., example=1200.0)
    orders_per_day: int = Field(..., example=25)
    working_hours: int = Field(..., example=9)

# ---------------------------------------------------------
# Policies & Actuarial
# ---------------------------------------------------------
class PolicyCreate(BaseModel):
    worker_id: str = Field(..., description="UUID of the insured worker")
    coverage_type: str = Field(..., example="income_loss", description="Code for the parametric trigger grouping")
    monthly_premium: float = Field(..., gt=0, example=250.0)
    coverage_amount: float = Field(..., gt=0, example=15000.0)

class Policy(PolicyCreate):
    id: str = Field(..., description="Unique UUID for the policy instance")
    status: str = Field(..., example="active", description="Policy lifecycle state (active, expired, cancelled)")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PremiumResponse(BaseModel):
    risk_score: float = Field(..., description="Calculated situational probability risk score")
    weekly_premium: float = Field(..., description="Automatically calculated dynamically adjusted premium")

# ---------------------------------------------------------
# Parametric Claims & Fraud
# ---------------------------------------------------------
class ClaimCreate(BaseModel):
    policy_id: str = Field(..., description="Target policy UUID")
    incident_date: datetime = Field(..., description="Exact ISO date of the disruptive event")
    description: str = Field(..., example="Severe waterlogging on main transit route", description="Contextual account")
    amount_requested: float = Field(..., gt=0, example=4500.0)
    evidence_urls: List[HttpUrl] = Field(default_factory=list, description="Array of image/video proof URLs")

class Claim(ClaimCreate):
    id: str = Field(..., description="UUID identity of the claim record")
    status: str = Field(..., example="investigating", description="Claim state pipeline (investigating, approved, denied)")
    fraud_probability: Optional[float] = Field(None, description="ML inference on likelihood of falsification")
    payout_approved: Optional[bool] = Field(None, description="Clearance flag for automated escrow disbursement")

class TriggerSimulationRequest(BaseModel):
    daily_income: float = Field(..., example=1200.0)
    rainfall: float = Field(..., example=75.5, description="Rainfall gauge in mm")
    aqi: float = Field(..., example=410.0, description="Air quality index")
    traffic: int = Field(..., example=95, description="Traffic congestion percentage")

class TriggerSimulationResponse(BaseModel):
    status: str = Field(..., example="payout_approved", description="The resolution flag of the simulation engine")
    payout_amount: float = Field(..., example=1200.0, description="Calculated amount to be disbursed")
    trigger_reason: str = Field(..., example="Parametric trigger threshold strictly met", description="Justification log")

# ---------------------------------------------------------
# Admin & Heatmaps
# ---------------------------------------------------------
class PayoutDistribution(BaseModel):
    weather_delay: int
    income_loss: int
    accident: int
    other: int

class AdminStatsResponse(BaseModel):
    total_workers: int
    active_policies: int
    total_revenue: float
    fraud_flags: int
    payout_distribution: PayoutDistribution
