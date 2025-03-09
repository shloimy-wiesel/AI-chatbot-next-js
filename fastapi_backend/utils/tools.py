import random

from httpx import request
from geopy.geocoders import Nominatim


def get_current_weather(location, unit="fahrenheit"):
    if unit == "celsius":
        temperature = random.randint(-34, 43)
    else:
        temperature = random.randint(-30, 110)

    latitude = None
    longitude = None

    geolocator = Nominatim(user_agent="geo_locator")
    location_data = geolocator.geocode(location)
    if location_data:
        longitude = location_data.longitude
        latitude = location_data.latitude
        # return location_data.latitude, location_data.longitude
    response = request(
        method="GET",
        url=f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto",
    )
    res = response.json()

    # print(f"res: {res}")

    return res
    # const weatherData = await response.json();
    # return {
    #     "temperature": temperature,
    #     "unit": unit,
    #     "location": location,
    # }
