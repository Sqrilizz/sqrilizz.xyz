import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi'

export default function WeatherCard() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Call Open-Meteo API directly (no backend needed)
        const TALLINN_LAT = '59.437'
        const TALLINN_LON = '24.7536'
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${TALLINN_LAT}&longitude=${TALLINN_LON}&current=temperature_2m,weather_code&timezone=auto`
        )
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
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

        // Convert weather code to icon number
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
        
        // Format to match expected structure
        const formatted = {
          Temperature: {
            Metric: {
              Value: Math.round(data.current.temperature_2m),
              Unit: 'C'
            }
          },
          WeatherText: getWeatherDescription(weatherCode),
          WeatherIcon: getWeatherIcon(weatherCode)
        }
        
        setWeather(formatted)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching weather:', error)
        setLoading(false)
      }
    }

    fetchWeather()
    // Обновляем каждые 30 минут
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (iconNumber) => {
    // OpenWeatherMap icon codes (weather condition IDs)
    if (iconNumber >= 200 && iconNumber < 300) return <WiThunderstorm size={32} /> // Thunderstorm
    if (iconNumber >= 300 && iconNumber < 600) return <WiRain size={32} /> // Drizzle/Rain
    if (iconNumber >= 600 && iconNumber < 700) return <WiSnow size={32} /> // Snow
    if (iconNumber >= 700 && iconNumber < 800) return <WiFog size={32} /> // Atmosphere (fog, mist, etc)
    if (iconNumber === 800) return <WiDaySunny size={32} /> // Clear
    if (iconNumber > 800) return <WiCloudy size={32} /> // Clouds
    return <WiCloudy size={32} />
  }

  if (loading) {
    return (
      <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 flex items-center justify-center shadow-lg">
        <div className="text-zinc-500 text-xs">Loading...</div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 flex items-center justify-center shadow-lg">
        <div className="text-zinc-500 text-xs">No data</div>
      </div>
    )
  }

  return (
    <motion.div 
      className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 flex items-center justify-between relative overflow-hidden group"
      whileHover={{ scale: 1.02 }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Weather-specific gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50" />
      
      <div className="relative z-10 flex items-center justify-between w-full">
      <div>
        <p className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Tallinn, Estonia
        </p>
        <motion.p 
          className="text-white text-2xl font-bold"
          key={weather.Temperature?.Metric?.Value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {Math.round(weather.Temperature?.Metric?.Value || 0)}°C
        </motion.p>
        <p className="text-zinc-400 text-xs mt-1">{weather.WeatherText}</p>
      </div>
      <motion.div 
        className="text-zinc-400"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {getWeatherIcon(weather.WeatherIcon)}
      </motion.div>
      </div>
    </motion.div>
  )
}
