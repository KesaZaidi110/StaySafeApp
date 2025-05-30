const fetch = require('node-fetch');

/**
 * Get latitude and longitude from a location string using OpenStreetMap Nominatim API.
 * @param {string} location - The location string (e.g., "Lucknow, India")
 * @returns {Promise<{latitude: number, longitude: number} | null>} - Returns coordinates or null if not found
 */
async function getLatLongFromLocation(location) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StaySafeApp/1.0 (your-email@example.com)' // identify your app politely
      }
    });

    if (!response.ok) {
      console.error('Geocoding API response not OK:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.length === 0) {
      console.warn('No geocoding results for:', location);
      return null;
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error('Error in geocoding service:', error);
    return null;
  }
}

module.exports = { getLatLongFromLocation };
