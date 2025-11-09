import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import StarField from './StarField'
import LanguageSwitcher from './LanguageSwitcher'

const DEFAULT_WISHLIST_ITEMS = []

const CATEGORIES = {
  all: { nameKey: 'all', icon: '🎯' },
  hardware: { nameKey: 'hardware', icon: '💻' },
  gaming: { nameKey: 'gaming', icon: '🎮' },
  peripherals: { nameKey: 'peripherals', icon: '⌨️' },
  audio: { nameKey: 'audio', icon: '🎵' },
  photography: { nameKey: 'photography', icon: '📸' }
}

const PRIORITIES = {
  high: { nameKey: 'high', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-500/10' },
  medium: { nameKey: 'medium', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/10' },
  low: { nameKey: 'low', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' }
}

export default function WishlistPage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [wishlistItems, setWishlistItems] = useState([])
  const [categories, setCategories] = useState(CATEGORIES)
  const [priorities, setPriorities] = useState(PRIORITIES)

  useEffect(() => {
    // Загружаем данные из JSON файла
    const loadWishlistData = async () => {
      try {
        const response = await fetch('/data/wishlist.json')
        const data = await response.json()
        
        setWishlistItems(data.items || [])
        setCategories(data.categories || CATEGORIES)
        setPriorities(data.priorities || PRIORITIES)
      } catch (error) {
        console.error('Ошибка загрузки wishlist:', error)
        // Fallback на дефолтные значения
        setWishlistItems(DEFAULT_WISHLIST_ITEMS)
        setCategories(CATEGORIES)
        setPriorities(PRIORITIES)
      }
    }

    loadWishlistData()
  }, [])

  const filteredItems = wishlistItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
    const priorityMatch = selectedPriority === 'all' || item.priority === selectedPriority
    return categoryMatch && priorityMatch
  })

  const totalPrice = filteredItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[$,]/g, ''))
    return sum + price
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b15] to-[#01010e] text-gray-100 relative overflow-hidden">
      <StarField />
      
      <div className="max-w-6xl mx-auto relative z-10 px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative inline-block mb-6"
          >
            <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 relative">
              🎯 {t('wishlist')}
            </h1>
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.4)",
                  "0 0 40px rgba(236, 72, 153, 0.6)",
                  "0 0 20px rgba(168, 85, 247, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-lg blur-xl"
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {t('wishlistDescription')} ✨
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-sm"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm shadow-lg"
            >
              <span className="text-purple-300">📦</span>
              <span className="ml-2 font-medium">{t('totalItems')}: {filteredItems.length}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 backdrop-blur-sm shadow-lg"
            >
              <span className="text-green-300">💰</span>
              <span className="ml-2 font-medium">{t('totalCost')}: ${totalPrice.toLocaleString()}</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <div className="card">
            <div className="flex flex-wrap gap-6 justify-center mb-6">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-medium text-purple-300 mr-2">🏷️ {t('category')}:</span>
                {Object.entries(categories).map(([key, category]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-600/50'
                    }`}
                  >
                    {category.icon} {t(category.nameKey)}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <span className="text-sm font-medium text-green-300 mr-2">⚡ {t('priority')}:</span>
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPriority('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedPriority === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-600/50'
                }`}
              >
                {t('all')}
              </motion.button>
              {Object.entries(priorities).map(([key, priority]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPriority(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedPriority === key
                      ? `bg-gradient-to-r ${priority.color} text-white shadow-lg`
                      : `${priority.bgColor} text-gray-300 hover:opacity-80 border border-gray-600/50`
                  }`}
                >
                  {t(priority.nameKey)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="card hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 1.4 }}
                  className="absolute top-4 right-4"
                >
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                    item.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-green-500 to-emerald-500'
                  } text-white shadow-lg backdrop-blur-sm`}>
                    {priorities[item.priority]?.nameKey ? t(priorities[item.priority].nameKey) : item.priority}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 1.5 }}
                  className="absolute top-4 left-4"
                >
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm border border-white/20">
                    {categories[item.category]?.icon} {categories[item.category]?.nameKey ? t(categories[item.category].nameKey) : item.category}
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1.6 }}
                >
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1.7 }}
                  className="flex items-center justify-between"
                >
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
                    {item.price}
                  </div>
                  
                  {item.link !== '#' && (
                    <motion.a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10">✨ {t('viewProduct')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <h3 className="text-xl font-semibold mb-2">{t('noItemsFound')}</h3>
            <p className="text-gray-400">{t('tryChangeFilters')}</p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              💝 {t('wantToHelp')}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {t('supportDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://www.donationalerts.com/r/sqrilizz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                💳 DonationAlerts
              </a>
              <a
                href="https://boosty.to/sqrilizz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                🚀 Boosty
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      <LanguageSwitcher />
    </div>
  )
}
