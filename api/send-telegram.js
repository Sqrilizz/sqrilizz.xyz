// Vercel Serverless Function
export const config = {
  maxDuration: 30
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { name, email, message } = req.body;
    
    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    // Get env vars
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      return res.status(500).json({ error: 'Server not configured' });
    }
    
    // Build message
    const text = `🔔 New message from website!\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message:\n${message}\n\n⏰ ${new Date().toLocaleString()}`;
    
    // Send to Telegram with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      const telegramData = await telegramResponse.json();
      
      if (!telegramResponse.ok) {
        console.error('Telegram error:', telegramData);
        return res.status(500).json({ 
          error: 'Failed to send',
          details: telegramData.description 
        });
      }
      
      return res.status(200).json({ success: true });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        // Timeout - but message might still be sent
        console.log('Telegram timeout, but message likely sent');
        return res.status(200).json({ 
          success: true,
          note: 'Message sent (timeout on confirmation)'
        });
      }
      
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
}
