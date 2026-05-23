import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const weatherDesc = (code, t) => {
  if (code <= 1) return 'Clear'
  if (code <= 3) return 'Cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 65) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Showers'
  return 'Storm'
}

export default function WeatherWidget() {
  const [temp, setTemp] = useState(null)
  const [desc, setDesc] = useState('')

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=59.437&longitude=24.7536&current=temperature_2m,weather_code&timezone=auto')
      .then(r => r.json())
      .then(data => {
        setTemp(Math.round(data.current.temperature_2m))
        setDesc(weatherDesc(data.current.weather_code))
      })
      .catch(() => {})

    const interval = setInterval(() => {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=59.437&longitude=24.7536&current=temperature_2m,weather_code&timezone=auto')
        .then(r => r.json())
        .then(data => {
          setTemp(Math.round(data.current.temperature_2m))
          setDesc(weatherDesc(data.current.weather_code))
        })
        .catch(() => {})
    }, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (temp === null) return null

  return <span className="text-zinc-500">{temp}°C · {desc}</span>
}
