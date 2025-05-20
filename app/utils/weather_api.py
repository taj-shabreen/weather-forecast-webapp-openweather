import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")  # The env variable name should be OPENWEATHER_API_KEY

print(f"🔑 API KEY LOADED: {API_KEY}")  # Debug print

def get_weather_data(city, country):
    try:
        url = (
            f"http://api.openweathermap.org/data/2.5/forecast?q={city},{country}"
            f"&appid={API_KEY}&units=metric"
        )
        print(f"📡 Sending request to: {url}")  # Debug

        response = requests.get(url)
        print(f"📋 Status Code: {response.status_code}")  # Debug
        print(f"🧾 API Response: {response.text[:500]}...")  # More detailed response

        if response.status_code == 200:
            data = response.json()

            # Extract current (first) weather condition
            condition = data['list'][0]['weather'][0]['main']     # ← MOST IMPORTANT
            temperature = data['list'][0]['main']['temp']
            humidity = data['list'][0]['main']['humidity']
            wind_speed = data['list'][0]['wind']['speed']

            print(f"🌤 Weather condition: {condition}")  # Debug
            return {
                'condition': condition,
                'temperature': temperature,
                'humidity': humidity,
                'wind_speed': wind_speed
            }
        else:
            print(f"⚠️ API returned error status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        return None

