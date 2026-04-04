import asyncio
import random
import uuid
from datetime import datetime
from services.ml_models import predict_income_loss

async def check_disruption_triggers_job():
    """
    Background job that runs every 5 minutes (300 seconds) to check real-time
    environmental and traffic triggers. If conditions are met, it triggers a
    parametric insurance payout simulation.
    """
    while True:
        try:
            print(f"[{datetime.utcnow().isoformat()}] Starting cyclical disruption trigger check...")
            
            # 1. Simulate fetching real-time data for different zones/workers.
            # In a real app, this would poll the Weather API, Traffic API, etc.
            mock_zone_data = {
                "rainfall": random.uniform(0, 100),   # mm
                "aqi": random.randint(50, 500),       # index
                "traffic": random.randint(20, 100),   # percentage congestion
                "flood_alert": random.choice([True, False, False, False]) # 25% chance of flood alert
            }
            
            print(f"  -> Simulated Environment Data: {mock_zone_data}")
            
            # 2. Evaluate triggers
            trigger_met = False
            trigger_reasons = []
            
            if mock_zone_data["rainfall"] > 60:
                trigger_met = True
                trigger_reasons.append("High Rainfall (>60mm)")
            
            if mock_zone_data["aqi"] > 400:
                trigger_met = True
                trigger_reasons.append("Severe AQI (>400)")
                
            if mock_zone_data["traffic"] > 90:
                trigger_met = True
                trigger_reasons.append("Severe Traffic Delay (>90%)")
                
            if mock_zone_data["flood_alert"]:
                trigger_met = True
                trigger_reasons.append("Active Flood Alert")
                
            # 3. Process payout event if trigger is met
            if trigger_met:
                print(f"  -> TRIGGERS MET: {', '.join(trigger_reasons)}")
                
                # Assume an average worker daily income purely for simulation
                base_daily_income = 1200 
                base_orders_today= 50
                base_hours_worked=10
                
                estimated_loss = predict_income_loss(
                    daily_income=base_daily_income,
                    orders_today= base_orders_today,
                    hours_worked= base_hours_worked,
                    rainfall=mock_zone_data["rainfall"],
                    aqi=mock_zone_data["aqi"],
                    traffic=mock_zone_data["traffic"],
                    city=1
                    
                )
                
                event_id = str(uuid.uuid4())
                print(f"  -> GENERATING AUTO-PAYOUT EVENT [{event_id}]")
                print(f"  -> Estimated Income Loss: ₹{round(estimated_loss, 2)}")
                print("  -> Payout queued for affected gig workers.")
            else:
                print("  -> No disruption triggers met. System nominal.")
                
        except Exception as e:
            print(f"Error in disruption trigger background task: {e}")
            
        print("  -> Sleeping for 5 minutes (300s)...")
        # To make the demo faster while testing locally, you can modify this to say 10 seconds.
        # But keeping it 300 to match the 5-minute requirement exactly.
        await asyncio.sleep(300)
