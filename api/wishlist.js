import fs from 'fs'
import path from 'path'

// Путь к файлу данных
const dataPath = path.join(process.cwd(), 'public', 'data', 'wishlist.json')

// Функция для чтения данных
function readWishlistData() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Ошибка чтения файла:', error)
    // Возвращаем дефолтные данные если файл не найден
    return {
      items: [],
      categories: {
        all: { nameKey: 'all', icon: '🎯' },
        hardware: { nameKey: 'hardware', icon: '💻' },
        gaming: { nameKey: 'gaming', icon: '🎮' },
        peripherals: { nameKey: 'peripherals', icon: '⌨️' },
        audio: { nameKey: 'audio', icon: '🎵' },
        photography: { nameKey: 'photography', icon: '📸' }
      },
      priorities: {
        high: { nameKey: 'high', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-500/10' },
        medium: { nameKey: 'medium', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/10' },
        low: { nameKey: 'low', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' }
      }
    }
  }
}

// Функция для записи данных
function writeWishlistData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Ошибка записи файла:', error)
    return false
  }
}

export default function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    // Возвращаем данные wishlist
    const data = readWishlistData()
    res.status(200).json(data)
  } 
  else if (req.method === 'POST') {
    // Сохраняем данные wishlist
    try {
      const newData = req.body
      
      // Валидация данных
      if (!newData || typeof newData !== 'object') {
        return res.status(400).json({ error: 'Неверный формат данных' })
      }

      // Сохраняем данные
      const success = writeWishlistData(newData)
      
      if (success) {
        res.status(200).json({ message: 'Данные сохранены успешно' })
      } else {
        res.status(500).json({ error: 'Ошибка сохранения данных' })
      }
    } catch (error) {
      console.error('Ошибка обработки POST запроса:', error)
      res.status(500).json({ error: 'Внутренняя ошибка сервера' })
    }
  }
  else {
    res.status(405).json({ error: 'Метод не поддерживается' })
  }
}
