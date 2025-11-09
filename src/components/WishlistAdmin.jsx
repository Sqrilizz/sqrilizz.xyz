import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StarField from './StarField'
import LanguageSwitcher from './LanguageSwitcher'

const ADMIN_PASSWORD = 'sqrilizz2024' // Измените на свой пароль

const DEFAULT_WISHLIST = []

const CATEGORIES = {
  hardware: { name: 'Железо', icon: '💻' },
  gaming: { name: 'Игры', icon: '🎮' },
  peripherals: { name: 'Периферия', icon: '⌨️' },
  audio: { name: 'Аудио', icon: '🎵' },
  photography: { name: 'Фото/Видео', icon: '📸' },
  software: { name: 'Софт', icon: '💿' },
  books: { name: 'Книги', icon: '📚' },
  other: { name: 'Другое', icon: '🎯' }
}

const PRIORITIES = {
  high: { name: 'Высокий', color: 'from-red-500 to-pink-500' },
  medium: { name: 'Средний', color: 'from-yellow-500 to-orange-500' },
  low: { name: 'Низкий', color: 'from-green-500 to-emerald-500' }
}

export default function WishlistAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [wishlistItems, setWishlistItems] = useState([])
  const [categories, setCategories] = useState(CATEGORIES)
  const [priorities, setPriorities] = useState(PRIORITIES)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('items') // items, categories, priorities

  // Форма для добавления/редактирования
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priority: 'medium',
    category: 'hardware',
    image: '',
    link: ''
  })

  useEffect(() => {
    // Проверяем авторизацию
    const savedAuth = localStorage.getItem('wishlist_admin_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }

    // Загружаем данные
    const loadWishlistData = async () => {
      try {
        // Сначала пробуем загрузить из localStorage (локальные изменения)
        const savedWishlist = localStorage.getItem('wishlist_items')
        const savedCategories = localStorage.getItem('wishlist_categories')
        const savedPriorities = localStorage.getItem('wishlist_priorities')

        if (savedWishlist || savedCategories || savedPriorities) {
          // Есть локальные изменения
          setWishlistItems(savedWishlist ? JSON.parse(savedWishlist) : [])
          setCategories(savedCategories ? JSON.parse(savedCategories) : CATEGORIES)
          setPriorities(savedPriorities ? JSON.parse(savedPriorities) : PRIORITIES)
        } else {
          // Загружаем из JSON файла
          const response = await fetch('/data/wishlist.json')
          const data = await response.json()
          
          setWishlistItems(data.items || [])
          setCategories(data.categories || CATEGORIES)
          setPriorities(data.priorities || PRIORITIES)
        }
      } catch (error) {
        console.error('Ошибка загрузки wishlist:', error)
        // Fallback на дефолтные значения
        setWishlistItems(DEFAULT_WISHLIST)
        setCategories(CATEGORIES)
        setPriorities(PRIORITIES)
      }
    }

    loadWishlistData()
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('wishlist_admin_auth', 'true')
      setPassword('')
    } else {
      alert('Неверный пароль!')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('wishlist_admin_auth')
  }

  const saveWishlist = (newWishlist) => {
    setWishlistItems(newWishlist)
    localStorage.setItem('wishlist_items', JSON.stringify(newWishlist))
  }

  const saveCategories = (newCategories) => {
    setCategories(newCategories)
    localStorage.setItem('wishlist_categories', JSON.stringify(newCategories))
  }

  const savePriorities = (newPriorities) => {
    setPriorities(newPriorities)
    localStorage.setItem('wishlist_priorities', JSON.stringify(newPriorities))
  }

  const resetToDefault = async () => {
    if (confirm('Сбросить все данные к исходным из файла? Все локальные изменения будут потеряны.')) {
      try {
        const response = await fetch('/data/wishlist.json')
        const data = await response.json()
        
        setWishlistItems(data.items || [])
        setCategories(data.categories || CATEGORIES)
        setPriorities(data.priorities || PRIORITIES)
        
        // Очищаем localStorage
        localStorage.removeItem('wishlist_items')
        localStorage.removeItem('wishlist_categories')
        localStorage.removeItem('wishlist_priorities')
        
        alert('Данные сброшены к исходным!')
      } catch (error) {
        console.error('Ошибка сброса данных:', error)
        alert('Ошибка при сбросе данных')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingItem) {
      // Редактирование
      const updatedItems = wishlistItems.map(item =>
        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
      )
      saveWishlist(updatedItems)
      setEditingItem(null)
    } else {
      // Добавление
      const newItem = {
        ...formData,
        id: Date.now()
      }
      saveWishlist([...wishlistItems, newItem])
      setShowAddForm(false)
    }

    // Сброс формы
    setFormData({
      title: '',
      description: '',
      price: '',
      priority: 'medium',
      category: 'hardware',
      image: '',
      link: ''
    })
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      priority: item.priority,
      category: item.category,
      image: item.image,
      link: item.link
    })
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Удалить этот элемент?')) {
      const updatedItems = wishlistItems.filter(item => item.id !== id)
      saveWishlist(updatedItems)
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setShowAddForm(false)
    setFormData({
      title: '',
      description: '',
      price: '',
      priority: 'medium',
      category: 'hardware',
      image: '',
      link: ''
    })
  }

  // Форма авторизации
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b15] to-[#01010e] text-gray-100 relative overflow-hidden flex items-center justify-center">
        <StarField />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            🔐 Админ-панель Wishlist
          </h1>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Введите пароль"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Войти
            </button>
          </form>
        </motion.div>
        
        <LanguageSwitcher />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b15] to-[#01010e] text-gray-100 relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            🛠️ Управление Wishlist
          </h1>
          <div className="flex gap-3">
            <a
              href="/wishlist"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              👁️ Посмотреть Wishlist
            </a>
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
            >
              🔄 Сбросить к исходным
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              🚪 Выйти
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'items'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            📦 Товары
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            🏷️ Категории
          </button>
          <button
            onClick={() => setActiveTab('priorities')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'priorities'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            ⚡ Приоритеты
          </button>
        </div>

        {/* Items Tab */}
        {activeTab === 'items' && (
          <>
            {/* Add Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mb-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
              >
                ➕ Добавить новый товар
              </button>
            )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? '✏️ Редактировать элемент' : '➕ Добавить новый элемент'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Цена *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="$999"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Описание *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Приоритет</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  {Object.entries(PRIORITIES).map(([key, priority]) => (
                    <option key={key} value={key}>{priority.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">URL изображения *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Ссылка на товар</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="https://example.com/product"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  {editingItem ? '💾 Сохранить' : '➕ Добавить'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  ❌ Отмена
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-400 font-bold">{item.price}</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {CATEGORIES[item.category]?.icon} {CATEGORIES[item.category]?.name}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                      item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {PRIORITIES[item.priority]?.name}
                    </span>
                  </div>
                </div>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm transition-colors"
                  >
                    🔗 Посмотреть
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {wishlistItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Wishlist пуст</h3>
            <p className="text-gray-400">Добавьте первый элемент!</p>
          </div>
        )}
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold mb-2">Управление категориями</h3>
            <p className="text-gray-400">Функция в разработке</p>
          </div>
        )}

        {/* Priorities Tab */}
        {activeTab === 'priorities' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Управление приоритетами</h3>
            <p className="text-gray-400">Функция в разработке</p>
          </div>
        )}
        </div>
      </div>
      
      <LanguageSwitcher />
    </div>
  )
}
