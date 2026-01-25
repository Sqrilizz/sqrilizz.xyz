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

  const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY
  const TALLINN_LOCATION_KEY = '127964'

  try {
    const response = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${TALLINN_LOCATION_KEY}?apikey=${ACCUWEATHER_API_KEY}&details=true`
    )

    if (!response.ok) {
      throw new Error(`AccuWeather API error: ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching weather:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch weather',
      message: error.message 
    })
  }
}
