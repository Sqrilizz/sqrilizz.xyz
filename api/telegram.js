// Telegram credentials из переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// Разрешённые источники для CORS
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',')

// Функция для проверки CORS
const checkCORS = (origin) => {
  return ALLOWED_ORIGINS.includes(origin)
}

// Функция для валидации данных формы
const validateFormData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' }
  }

  const { name, email, message } = data

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' }
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { valid: false, error: 'Valid email is required' }
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'Message is required' }
  }

  return { valid: true }
}

// Функция для отправки сообщения в Telegram
const sendToTelegram = async (name, email, message) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured')
    throw new Error('Telegram service not configured')
  }

  const telegramMessage = `
🔔 <b>Новое сообщение с сайта!</b>

👤 <b>Имя:</b> ${escapeHtml(name)}
📧 <b>Email:</b> ${escapeHtml(email)}
💬 <b>Сообщение:</b>
${escapeHtml(message)}
  `

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Telegram API error response:', error)
      throw new Error(`Telegram API error: ${error.description || 'Unknown error'}`)
    }

    const result = await response.json()
    console.log('Message sent to Telegram successfully')
    return result
  } catch (error) {
    console.error('Error sending message to Telegram:', error)
    throw error
  }
}

// Функция для экранирования HTML в Telegram
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

export default async function handler(req, res) {
  // Проверяем CORS
  const origin = req.headers.origin
  const isAllowedOrigin = origin && checkCORS(origin)

  // Устанавливаем CORS заголовки
  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')

  // Обработка preflight запроса
  if (req.method === 'OPTIONS') {
    if (!isAllowedOrigin) {
      return res.status(403).json({ error: 'CORS not allowed' })
    }
    return res.status(200).end()
  }

  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Проверяем CORS для POST
  if (!isAllowedOrigin) {
    return res.status(403).json({ error: 'CORS not allowed' })
  }

  try {
    const { name, email, message } = req.body

    // Валидируем данные формы
    const validation = validateFormData({ name, email, message })
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // Отправляем в Telegram
    await sendToTelegram(name, email, message)

    return res.status(200).json({ 
      success: true,
      message: 'Message sent successfully' 
    })

  } catch (error) {
    console.error('Telegram API error:', error.message)
    return res.status(500).json({ 
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
