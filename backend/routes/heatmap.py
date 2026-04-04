from fastapi import APIRouter
from typing import List
from core.logger import logger
import random

router = APIRouter(prefix="/heatmap", tags=["heatmap"])

@router.get(
    "/risk-zones", 
    response_model=List[List[float]], 
    summary="Get Risk Zones Heatmap",
    description="Returns a list of coordinates natively consumed by Leaflet.js."
)
async def get_risk_zones():
    logger.info("Generating spatial risk-zones heatmap cluster.")
    cities = [
        {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
        {"name": "Delhi", "lat": 28.7041, "lon": 77.1025},
        {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946},
        {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873},
    ]
    
    heatmap_data = []
    for city in cities:
        num_points = random.randint(15, 25)
        for _ in range(num_points):
            jitter_lat = random.uniform(-0.1, 0.1)
            jitter_lon = random.uniform(-0.1, 0.1)
            lat = round(city["lat"] + jitter_lat, 5)
            lon = round(city["lon"] + jitter_lon, 5)
            risk_intensity = round(random.uniform(0.1, 1.0), 3)
            heatmap_data.append([lat, lon, risk_intensity])
            
    return heatmap_data