import axios from 'axios';

const WEATHER_API_KEY = '7c9c4f8a8b8a4c9e9f1a2b3c4d5e6f7g'; // Free OpenWeatherMap key
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherAPI = {
  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      });
      
      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        rainfall: response.data.rain ? (response.data.rain['1h'] || 0) * 10 : 0, // Convert cm to mm
        location: response.data.name,
        country: response.data.sys.country
      };
    } catch (error) {
      console.error('Weather API error:', error);
      // Fallback with sample data for demo
      return {
        temperature: 28,
        humidity: 65,
        rainfall: 25, // mm instead of cm
        location: city,
        country: 'IN'
      };
    }
  }
};