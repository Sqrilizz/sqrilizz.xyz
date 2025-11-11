import { Redis } from '@upstash/redis'

// Инициализация Redis
const getRedisUrl = () => {
  const url = process.env.SqrilizzStorage_KV_REST_API_URL || 
             process.env.sqrilizStorage_KV_REST_API_URL || 
             process.env.UPSTASH_REDIS_REST_URL
  // Убеждаемся что URL начинается с https://
  if (url && !url.startsWith('http')) {
    return `https://${url}`
  }
  return url
}

const redis = new Redis({
  url: getRedisUrl(),
  token: process.env.SqrilizzStorage_KV_REST_API_TOKEN || 
         process.env.sqrilizStorage_KV_REST_API_TOKEN || 
         process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Ключ для хранения данных в KV
const KV_KEY = 'wishlist_data'

// Дефолтные данные
const DEFAULT_DATA = {
  items: [
    {
      title: "Lenovo ThinkPad X13",
      description: "AMD Ryzen 5 PRO 4650U - 2,10GHz | mälu 16 GB | kõvaketas 256 GB M.2 SSD | 13,3\" FHD IPS | klaviatuur - Eesti klahvistik valgustusega | a/c adapter | Windows 11 | ID-kaardilugeja | Garantii 6 kuud",
      price: "250€",
      priority: "high",
      category: "hardware",
      image: "https://www.bitboard.ee/9402-large_default/sulearvuti-lenovo-thinkpad-x13-gen-1.jpg",
      link: "https://www.bitboard.ee/en/used-laptops/8574-sulearvuti-lenovo-thinkpad-x13-gen-1.html",
      id: 1762701556068
    },
    {
      title: "Pop! Aki Hayakawa",
      description: "It's time to tear up evil with Pop! Aki Hayakawa! Rev up your Chainsaw Man collection by making this Devil Hunter the next addition to your Anime lineup. Vinyl figure is approximately 4.65 in (11.8 cm) tall.",
      price: "16€",
      priority: "low",
      category: "other",
      image: "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwa8a5dd35/images/funko/upload/80319_CSM_Aki_POP_GLAM-WEB.png?sw=800&sh=800",
      link: "https://funko.com/ee/pop-aki-hayakawa/80319.html",
      id: 1762701604280
    },
    {
      title: "Metro 2033 Book",
      description: "The Third World War wiped humanity off the face of the Earth. The planet has become desolate. Megacities turned to dust and ashes. Railroads rust. Satellites dangle lonely in orbit. Radio is silent on all frequencies. Only those who, upon...",
      price: "25.59€",
      priority: "medium",
      category: "books",
      image: "https://mnogoknig.com/storage/media/1042123/conversions/019309ed-7f84-771e-b1f0-a0d2fefe9174-large.webp",
      link: "https://mnogoknig.com/en/products/272346/metro-2033",
      id: 1762701650647
    },
    {
      title: "Berserk Deluxe Volume 1",
      description: "Have you got the Guts? Kentaro Miura´s Berserk has outraged, horrified, and delighted manga and anime fanatics since 1989, creating an international legion of hardcore devotees and inspiring a plethora of TV series, feature films, and video games. And now the badass champion of adult fantasy manga is presented in an oversized 7\" x 10\" deluxe hardcover edition, nearly 700 pages amassing the first three Berserk volumes, with following volumes to come to serve up the entire series in handsome bookshelf collections. No Guts, no glory!",
      price: "42.95€",
      priority: "low",
      category: "books",
      image: "https://www.apollo.ee/_next/image?url=https%3A%2F%2Fcdn.apollo.ee%2Fo%2Fapollo%2F3%2F2%2Ff%2F9%2F32f9f200496edbf8f172a9b5e2b9017b5d407011_9781506711980.jpg&w=256&q=75",
      link: "https://www.apollo.ee/et/berserk-deluxe-volume-1.html",
      id: 1762804628696
    },
    {
      title: "Берсерк. Том 4",
      description: "Бой за боем, победа за победой — и вот уже армия королевства Мидленд, в состав которой теперь входит и Отряд Соколов во главе с Гриффитом, начинает теснить неприятеля из империи Тюдоров. Но для окончательной победы в войне Мидленду необходимо вернуть...",
      price: "31.29€",
      priority: "low",
      category: "books",
      image: "https://mnogoknig.com/storage/media/980568/conversions/cover-(24)-large.webp",
      link: "https://mnogoknig.com/ru/products/1236042/berserk-tom-4",
      id: 1762804714892
    },
    {
      title: "Metro Exodus Necklace",
      description: "просто кулон из игры",
      price: "3€",
      priority: "high",
      category: "other",
      image: "https://ae-pic-a1.aliexpress-media.com/kf/S250e9252fd754ee0a0478ff657761f90J.jpg_220x220q75.jpg_.avif",
      link: "https://surl.li/ytctcc",
      id: 1762804917188
    },
    {
      title: "Logitech G435 Lightspeed",
      description: "juhtmevaba kõrvaklapid",
      price: "51€",
      priority: "medium",
      category: "peripherals",
      image: "https://gameroom.ee/55918/logitech-g435-lightspeed-must-juhtmevaba.jpg",
      link: "https://gameroom.ee/et/juhtmeta-korvaklapid/products/logitech-g435-lightspeed-must-juhtmevaba-7816",
      id: 1762805140567
    },
    {
      title: "LORGAR MSA10W",
      description: "да",
      price: "38€",
      priority: "medium",
      category: "peripherals",
      image: "https://gameroom.ee/153579/lorgar-msa10w-optical-wireless-mouse-12000-dpi.jpg",
      link: "https://gameroom.ee/et/juhtmevaba-hiir/products/lorgar-msa10w-optical-wireless-mouse-12000-dpi-24230",
      id: 1762805277637
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
  return (
    (process.env.SqrilizzStorage_KV_REST_API_URL && process.env.SqrilizzStorage_KV_REST_API_TOKEN) ||
    (process.env.sqrilizStorage_KV_REST_API_URL && process.env.sqrilizStorage_KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  )
}

// Функция для чтения данных из Redis или fallback
async function readWishlistData() {
  if (isRedisAvailable()) {
    try {
      console.log('Попытка чтения из Redis...')
      const data = await redis.get(KV_KEY)
      console.log('Данные успешно прочитаны из Redis')
      return data || DEFAULT_DATA
    } catch (error) {
      console.error('Ошибка чтения из Redis:', error.message)
      console.error('Redis URL:', getRedisUrl())
    }
  } else {
    console.log('Redis переменные недоступны:', {
      SqrilizzStorage_url: !!process.env.SqrilizzStorage_KV_REST_API_URL,
      SqrilizzStorage_token: !!process.env.SqrilizzStorage_KV_REST_API_TOKEN,
      sqrilizStorage_url: !!process.env.sqrilizStorage_KV_REST_API_URL,
      sqrilizStorage_token: !!process.env.sqrilizStorage_KV_REST_API_TOKEN
    })
  }
  
  // Fallback - возвращаем дефолтные данные
  console.log('Используем дефолтные данные')
  return DEFAULT_DATA
}

// Функция для записи данных в Redis или fallback
async function writeWishlistData(data) {
  if (isRedisAvailable()) {
    try {
      console.log('Попытка записи в Redis...')
      await redis.set(KV_KEY, data)
      console.log('Данные успешно сохранены в Redis')
      return true
    } catch (error) {
      console.error('Ошибка записи в Redis:', error.message)
      console.error('Redis URL:', getRedisUrl())
    }
  } else {
    console.log('Redis переменные недоступны для записи')
  }
  
  // Fallback - логируем что данные не сохранены
  console.log('Данные не сохранены (только в памяти)')
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
