// Серверный API endpoint для безопасной отправки в Telegram
// Rate limiting и защита от спама

const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 минута
const MAX_REQUESTS = 3; // максимум 3 запроса в минуту с одного IP

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  
  // Удаляем старые запросы
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

function validateInput(data) {
  const { name, email, message } = data;
  
  if (!name || !email || !message) {
    return { valid: false, error: 'Все поля обязательны' };
  }
  
  if (name.length > 100 || email.length > 100 || message.length > 1000) {
    return { valid: false, error: 'Превышена максимальная длина полей' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Неверный формат email' };
  }
  
  return { valid: true };
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // В продакшене замени на свой домен
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
  
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ 
      error: 'Слишком много запросов. Попробуйте позже.' 
    });
  }
  
  // Валидация входных данных
  const validation = validateInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  const { name, email, message } = req.body;
  
  // Получаем токен из серверных переменных окружения
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured');
    return res.status(500).json({ error: 'Сервер не настроен' });
  }
  
  try {
    // Экранируем HTML для безопасности
    const escapeHtml = (text) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
    const telegramMessage = `
🔔 <b>Новое сообщение с сайта!</b>

👤 <b>Имя:</b> ${escapeHtml(name)}
📧 <b>Email:</b> ${escapeHtml(email)}
💬 <b>Сообщение:</b>
${escapeHtml(message)}

⏰ <i>${new Date().toLocaleString('ru-RU')}</i>
    `.trim();
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      throw new Error('Ошибка отправки в Telegram');
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Сообщение отправлено' 
    });
    
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return res.status(500).json({ 
      error: 'Ошибка отправки сообщения' 
    });
  }
}
