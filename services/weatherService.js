const axios = require('axios');
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY || '050a584b5302d4df807328e59f05b4c9';

async function getWeatherByCity(city) {
  if (!city || typeof city !== 'string' || city.trim() === '') {
    return { data: null, error: 'Invalid city name.' };
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Weather API Error:', error.response ? error.response.data : error.message);
    return { data: null, error: 'City not found or API error.' };
  }
}

module.exports = {
  getWeatherByCity
};
