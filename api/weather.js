export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const TALLINN_LAT = '59.437'
  const TALLINN_LON = '24.7536'

  try {
    // Using Open-Meteo API (no key required!)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${TALLINN_LAT}&longitude=${TALLINN_LON}&current=temperature_2m,weather_code&timezone=auto`
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Open-Meteo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Weather code mapping (WMO Weather interpretation codes)
    const getWeatherDescription = (code) => {
      const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      }
      return weatherCodes[code] || 'Unknown'
    }

    // Convert weather code to icon number (similar to OpenWeather)
    const getWeatherIcon = (code) => {
      if (code === 0 || code === 1) return 800 // Clear
      if (code === 2 || code === 3) return 801 // Clouds
      if (code === 45 || code === 48) return 741 // Fog
      if (code >= 51 && code <= 55) return 300 // Drizzle
      if (code >= 61 && code <= 65) return 500 // Rain
      if (code >= 71 && code <= 77) return 600 // Snow
      if (code >= 80 && code <= 82) return 521 // Rain showers
      if (code >= 85 && code <= 86) return 621 // Snow showers
      if (code >= 95 && code <= 99) return 200 // Thunderstorm
      return 801
    }

    const weatherCode = data.current.weather_code
    
    // Convert to AccuWeather-like format for compatibility
    const formatted = [{
      Temperature: {
        Metric: {
          Value: Math.round(data.current.temperature_2m),
          Unit: 'C'
        }
      },
      WeatherText: getWeatherDescription(weatherCode),
      WeatherIcon: getWeatherIcon(weatherCode),
      HasPrecipitation: weatherCode >= 51,
      PrecipitationType: weatherCode >= 71 && weatherCode <= 86 ? 'Snow' : weatherCode >= 51 ? 'Rain' : null
    }]
    
    return res.status(200).json(formatted)
  } catch (error) {
    console.error('Error fetching weather:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch weather',
      message: error.message 
    })
  }
}
