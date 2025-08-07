# 🌤️ AccuWeather API Setup Guide

## Step 1: Get AccuWeather API Key

1. **Visit**: https://developer.accuweather.com/
2. **Sign Up**: Create free account
3. **Create App**: Register your application
4. **Get API Key**: Copy your API key (50 calls/day free)

## Step 2: Add API Key to Project

Replace `YOUR_ACCUWEATHER_API_KEY_HERE` in:
```
frontend/src/services/weatherAPI.js
```

With your actual API key:
```javascript
const ACCUWEATHER_API_KEY = 'your_actual_api_key_here';
```

## Step 3: How AccuWeather API Works

1. **Location Search**: Find location key for city
2. **Current Conditions**: Get detailed weather data
3. **Auto-fill Form**: Temperature, humidity, rainfall

## AccuWeather Advantages:
✅ **High Accuracy**: Professional weather service
✅ **Detailed Data**: Humidity, precipitation, conditions
✅ **Reliable**: Enterprise-grade API
✅ **Agricultural Focus**: Detailed environmental data

## API Endpoints Used:
- **Location Search**: `/locations/v1/cities/search`
- **Current Weather**: `/currentconditions/v1/{locationKey}`

## Data Retrieved:
- Temperature (°C)
- Humidity (%)
- Rainfall (mm - past 24 hours)
- Weather conditions text
- Location name and country

**Please provide your AccuWeather API key to complete the integration!**