from fastapi import APIRouter
from typing import List
from core.logger import logger
from models.schemas import HeatmapPoint
import random

router = APIRouter(prefix="/heatmap", tags=["heatmap"])

@router.get(
    "/city-risk", 
    response_model=List[HeatmapPoint], 
    summary="Get City Risk Heatmap",
    description="Returns a list of dictionaries with lat, lon, and categoric risk."
)
async def get_city_risk():
    logger.info("Generating categoric city risk heatmap cluster.")
    cities = [
        {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
        {"name": "Delhi", "lat": 28.7041, "lon": 77.1025},
        {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946},
        {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873},
    ]
    
    heatmap_data = []
    for city in cities:
        # Generate random incident clusters within proximity of the city
        num_points = random.randint(15, 25)
        for _ in range(num_points):
            jitter_lat = random.uniform(-0.1, 0.1)
            jitter_lon = random.uniform(-0.1, 0.1)
            lat = round(city["lat"] + jitter_lat, 5)
            lon = round(city["lon"] + jitter_lon, 5)
            
            risk_val = random.random()
            if risk_val > 0.7:
                risk_level = "high"
            elif risk_val > 0.3:
                risk_level = "medium"
            else:
                risk_level = "low"
                
            heatmap_data.append(
                HeatmapPoint(lat=lat, lon=lon, risk=risk_level)
            )
            
    return heatmap_data