import random

def get_weather_data(city: str) -> dict:
    """
    Fetches real-time weather data for a given city.
    Using mock data for demonstration.
    """
    # In a real scenario, this would call OpenWeatherMap API or similar
    # e.g., requests.get(f'http://api.weatherapi.com/.../?q={city}')
    return {
        "rainfall": round(random.uniform(0.0, 150.0), 1),
        "temperature": round(random.uniform(20.0, 45.0), 1)
    }

def get_aqi_data(city: str) -> dict:
    """
    Fetches real-time AQI data for a given city.
    Using mock data for demonstration.
    """
    # In a real scenario, this would call an AQI provider like WAQI
    return {
        "aqi": random.randint(50, 500)
    }

def get_traffic_data(city: str) -> dict:
    """
    Fetches real-time traffic congestion context.
    Using mock data for demonstration.
    """
    # In a real scenario, this could hit TomTom API or Google Maps Distance Matrix
    return {
        "traffic": random.randint(10, 100) # congestion percentage
    }

def get_aggregated_zone_data(city: str = "Mumbai") -> dict:
    """
    Aggregates realtime parametric telemetry signals for a given geographic zone.
    Returns dictionary with combined metrics for the trigger engine.
    """
    weather = get_weather_data(city)
    aqi_data = get_aqi_data(city)
    traffic_data = get_traffic_data(city)

    return {
        "rainfall": weather.get("rainfall", 0.0),
        "temperature": weather.get("temperature", 25.0),
        "aqi": aqi_data.get("aqi", 0),
        "traffic": traffic_data.get("traffic", 0)
    }
