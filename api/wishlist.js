import { Redis } from '@upstash/redis'

// Инициализация Redis
const redis = Redis.fromEnv()

// Ключ для хранения данных в KV
const KV_KEY = 'wishlist_data'

// Дефолтные данные
const DEFAULT_DATA = {
  items: [
    {
      id: 1,
      title: "RTX 4090",
      description: "Мощная видеокарта для разработки и игр",
      price: "$1,599",
      priority: "high",
      category: "hardware",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
      link: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/"
    },
    {
      id: 2,
      title: "MacBook Pro M3 Max",
      description: "Для мобильной разработки и дизайна",
      price: "$3,999",
      priority: "high",
      category: "hardware",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      link: "https://www.apple.com/macbook-pro/"
    },
    {
      id: 3,
      title: "Steam Deck OLED",
      description: "Портативная игровая консоль",
      price: "$649",
      priority: "medium",
      category: "gaming",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
      link: "https://store.steampowered.com/steamdeck"
    },
    {
      id: 4,
      title: "Mechanical Keyboard",
      description: "Кастомная механическая клавиатура",
      price: "$299",
      priority: "medium",
      category: "peripherals",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      id: 5,
      title: "Studio Monitors",
      description: "Профессиональные мониторы для звука",
      price: "$599",
      priority: "low",
      category: "audio",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      id: 6,
      title: "Drone DJI Mini 4 Pro",
      description: "Для съемки видео и фотографии",
      price: "$759",
      priority: "low",
      category: "photography",
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
      link: "https://www.dji.com/mini-4-pro"
    }
  ],
  categories: {
    all: { nameKey: 'all', icon: '🎯' },
    hardware: { nameKey: 'hardware', icon: '💻' },
    gaming: { nameKey: 'gaming', icon: '🎮' },
    peripherals: { nameKey: 'peripherals', icon: '⌨️' },
    audio: { nameKey: 'audio', icon: '🎵' },
    photography: { nameKey: 'photography', icon: '📸' },
    software: { nameKey: 'software', icon: '💿' },
    books: { nameKey: 'books', icon: '📚' },
    other: { nameKey: 'other', icon: '🎯' }
  },
  priorities: {
    high: { nameKey: 'high', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-500/10' },
    medium: { nameKey: 'medium', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/10' },
    low: { nameKey: 'low', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' }
  }
}

// Проверяем доступность Redis
const isRedisAvailable = () => {
  return process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
}

// Функция для чтения данных из Redis или fallback
async function readWishlistData() {
  if (isRedisAvailable()) {
    try {
      const data = await redis.get(KV_KEY)
      return data || DEFAULT_DATA
    } catch (error) {
      console.error('Ошибка чтения из Redis:', error)
    }
  }
  
  // Fallback - возвращаем дефолтные данные
  console.log('Redis недоступен, используем дефолтные данные')
  return DEFAULT_DATA
}

// Функция для записи данных в Redis или fallback
async function writeWishlistData(data) {
  if (isRedisAvailable()) {
    try {
      await redis.set(KV_KEY, data)
      console.log('Данные сохранены в Redis')
      return true
    } catch (error) {
      console.error('Ошибка записи в Redis:', error)
    }
  }
  
  // Fallback - логируем что данные не сохранены
  console.log('Redis недоступен, данные не сохранены (только в памяти)')
  return false
}

export default async function handler(req, res) {
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
    try {
      const data = await readWishlistData()
      res.status(200).json(data)
    } catch (error) {
      console.error('Ошибка GET запроса:', error)
      res.status(500).json({ error: 'Ошибка загрузки данных' })
    }
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
      const success = await writeWishlistData(newData)
      
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
