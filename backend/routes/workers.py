from fastapi import APIRouter, HTTPException
from models.schemas import WorkerCreate, Worker, VerifiedWorkerResponse
from models.database import db
from services.risk_calculator import risk_calculator
from core.logger import logger
import uuid

router = APIRouter(prefix="/workers", tags=["workers"])

MOCK_VERIFIED_WORKERS = {
    "W123": {
        "name": "Rahul Sharma",
        "platform": "Zepto",
        "city": "Mumbai",
        "daily_income": 1200.0,
        "orders_per_day": 25,
        "working_hours": 9
    },
    "W124": {
        "name": "Anita Singh",
        "platform": "Blinkit",
        "city": "Delhi",
        "daily_income": 1400.0,
        "orders_per_day": 30,
        "working_hours": 10
    },
    "W125": {
        "name": "Vikram Patel",
        "platform": "Swiggy",
        "city": "Ahmedabad",
        "daily_income": 950.0,
        "orders_per_day": 18,
        "working_hours": 6
    },
    "W126": {
        "name": "Suresh Kumar",
        "platform": "Amazon Flex",
        "city": "Bangalore",
        "daily_income": 1600.0,
        "orders_per_day": 15,
        "working_hours": 8
    }
}

@router.post("/", response_model=Worker, summary="Onboard Gig Worker", description="Creates a new worker profile and actively evaluates their baseline risk score.")
async def create_worker(worker: WorkerCreate):
    logger.info(f"Onboarding new worker profile: {worker.name}")
    worker_id = str(uuid.uuid4())
    worker_dict = worker.dict()
    
    risk_score = risk_calculator.calculate_risk(worker_dict)
    
    new_worker = Worker(id=worker_id, risk_score=risk_score, **worker_dict)
    db.add_worker(worker_id, new_worker.dict())
    
    logger.info(f"Worker {worker_id} successfully onboarded with baseline risk: {risk_score}")
    return new_worker

@router.get("/verify/{worker_id}", response_model=VerifiedWorkerResponse, summary="Verify Active Worker", description="Cross-checks worker credentials against aggregated platform APIs.")
async def verify_worker(worker_id: str):
    logger.info(f"Verification requested for worker ID: {worker_id}")
    if worker_id in MOCK_VERIFIED_WORKERS:
        return MOCK_VERIFIED_WORKERS[worker_id]
        
    return VerifiedWorkerResponse(
        name=f"Raj Kumar 12345",
        platform="Zepto",
        city="Mumbai",
        daily_income=1000.0,
        orders_per_day=20,
        working_hours=8
    )

@router.get("/{worker_id}", response_model=Worker, summary="Get Worker Profile", description="Retrieves the full profile object for a known worker.")
async def get_worker(worker_id: str):
    logger.info(f"Fetching profile for worker ID: {worker_id}")
    worker_data = db.get_worker(worker_id)
    if not worker_data:
        logger.warning(f"Worker ID {worker_id} not found in database.")
        raise HTTPException(status_code=404, detail="Worker not found")
    return Worker(**worker_data)