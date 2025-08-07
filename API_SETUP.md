# 🌤️ Weather API Setup Guide

## Step 1: Get OpenWeatherMap API Key

1. **Visit**: https://openweathermap.org/api
2. **Sign Up**: Create free account
3. **Get API Key**: Go to API Keys section
4. **Copy Key**: Save your API key

## Step 2: Add API Key to Project

Replace `YOUR_API_KEY_HERE` in:
```
frontend/src/services/weatherAPI.js
```

With your actual API key:
```javascript
const WEATHER_API_KEY = 'your_actual_api_key_here';
```

## Step 3: How It Works

1. **User enters location** (e.g., "Mumbai", "Delhi", "Pune")
2. **Clicks weather fetch button** (cloud download icon)
3. **System automatically fills**:
   - Temperature (°C)
   - Humidity (%)
   - Rainfall (mm)

## Alternative APIs (if needed):

### WeatherAPI.com
- **Free**: 1M calls/month
- **URL**: https://www.weatherapi.com/
- **Better for**: More detailed forecasts

### AccuWeather
- **Free**: 50 calls/day
- **URL**: https://developer.accuweather.com/
- **Better for**: High accuracy

## Features Added:
✅ Auto-fill weather data from location
✅ Real-time weather fetching
✅ Error handling for invalid locations
✅ Loading indicators
✅ User-friendly interface