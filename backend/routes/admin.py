from fastapi import APIRouter
from models.database import db
from models.schemas import AdminStatsResponse
from core.logger import logger

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get(
    "/dashboard", 
    response_model=AdminStatsResponse, 
    summary="Dashboard Stats", 
    description="Retrieve live aggregated statistics."
)
async def get_dashboard_stats():
    logger.info("Admin dashboard stats requested.")
    return {
        "total_workers": len(db.workers),
        "total_policies": len(db.policies),
        "total_revenue": sum(p.get("monthly_premium", 0.0) for p in db.policies.values()) if db.policies else 0.0,
        "fraud_flags": sum(1 for c in db.claims.values() if c.get("fraud_probability", 0.0) > 0.2) if db.claims else 0,
        "payout_distribution": {
            "weather_delay": 0,
            "income_loss": 0,
            "accident": 0,
            "other": 0
        }
    }

@router.get(
    "/stats", 
    response_model=AdminStatsResponse, 
    summary="Simulated Admin Stats",
    description="Returns simulated demo data for the admin analytics dashboard."
)
async def get_simulated_stats():
    logger.info("Admin simulated stats requested.")
    return {
        "total_workers": 4205,
        "active_policies": 3812,
        "total_revenue": 1450000.00,
        "fraud_flags": 47,
        "payout_distribution": {
            "weather_delay": 45,
            "income_loss": 30,
            "accident": 15,
            "other": 10
        }
    }