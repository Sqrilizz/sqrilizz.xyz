import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchDiscordActivity, getMainActivity, formatActivityTime, LanyardWebSocket, DISCORD_CONFIG, getDiscordAvatarUrl, getDefaultDiscordAvatarUrl, getActivityImageUrl, getActivityImageText, formatDiscordUsername, getUserTag, getClanBadgeUrl, getClanTag, getAvatarDecorationUrl, getUserBadges } from '../config/discord'

export default function DiscordRPC() {
  const [discordData, setDiscordData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ws = null

    const loadDiscordActivity = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const result = await fetchDiscordActivity()
        
        if (result.success) {
          setDiscordData(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Первоначальная загрузка
    loadDiscordActivity()

    // WebSocket для real-time обновлений (опционально)
    try {
      ws = new LanyardWebSocket(DISCORD_CONFIG.USER_ID, (data) => {
        setDiscordData({
          status: data.discord_status,
          activities: data.activities || [],
          listening_to_spotify: data.listening_to_spotify || null,
          user: data.discord_user
        })
      })
      ws.connect()
    } catch (wsError) {
      console.warn('WebSocket connection failed, using polling instead')
      // Fallback: обновляем каждые 30 секунд через HTTP
      const interval = setInterval(loadDiscordActivity, 30000)
      return () => clearInterval(interval)
    }

    return () => {
      if (ws) {
        ws.disconnect()
      }
    }
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'dnd': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 h-[160px] flex items-center justify-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-sm">Loading Discord activity...</span>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 h-[160px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
          <span className="text-gray-400 text-xs">Discord API Error</span>
        </div>
      </motion.div>
    )
  }

  if (!discordData || discordData.status === 'offline') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="card hover:shadow-xl hover:shadow-[#5865F2]/20 transition-all duration-300 h-[160px] relative overflow-hidden border border-[#5865F2]/10 hover:border-[#5865F2]/30 flex items-center justify-center"
      >
        {/* Градиентный фон */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/5 via-transparent to-purple-600/5 pointer-events-none" />
        
        {/* Discord брендинг */}
        <motion.div 
          className="absolute top-2 right-2"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="p-1 rounded-full bg-[#5865F2]/10 backdrop-blur-sm">
            <svg className="w-3 h-3 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-2 h-full w-full px-4">
          {/* Статус индикатор оффлайн */}
          <motion.div 
            className="w-3 h-3 bg-gray-500 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Информация об оффлайн статусе */}
          <div className="text-gray-400 text-sm">
            Currently offline
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute top-2 left-2 w-16 h-16 bg-gradient-to-br from-gray-500/5 to-gray-600/5 rounded-full blur-lg pointer-events-none" />
      </motion.div>
    )
  }

  // Получаем основную активность (исключая Custom Status)
  const mainActivity = getMainActivity(discordData.activities)
  const spotifyActivity = discordData.listening_to_spotify

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.4, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="card hover:shadow-xl hover:shadow-[#5865F2]/20 transition-all duration-300 h-[160px] relative overflow-hidden border border-[#5865F2]/10 hover:border-[#5865F2]/30 flex items-center justify-center"
    >
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/5 via-transparent to-purple-600/5 pointer-events-none" />
      
      {/* Discord брендинг с анимацией */}
      <motion.div 
        className="absolute top-2 right-2"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="p-1 rounded-full bg-[#5865F2]/10 backdrop-blur-sm">
          <svg className="w-3 h-3 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 h-full w-full">
        {/* Активность с анимацией */}
        <motion.div 
          className="flex-1 min-w-0 w-full"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {spotifyActivity ? (
            <>
              <motion.div 
                className="text-white text-sm font-medium truncate flex items-center gap-1"
                animate={{ opacity: [1, 0.8, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-green-400">🎵</span>
                {spotifyActivity.song}
              </motion.div>
              <div className="text-gray-300 text-xs truncate">
                by {spotifyActivity.artist}
              </div>
              <div className="text-gray-400 text-xs truncate">
                on {spotifyActivity.album}
              </div>
            </>
          ) : mainActivity ? (
            <div className="flex items-center gap-3 w-full">
              {/* Большой логотип приложения */}
              <div className="relative flex-shrink-0">
                {getActivityImageUrl(mainActivity, 'large', 48) ? (
                  <>
                    <img 
                      src={getActivityImageUrl(mainActivity, 'large', 48)}
                      alt={getActivityImageText(mainActivity, 'large') || mainActivity.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      title={getActivityImageText(mainActivity, 'large')}
                    />
                    {/* Маленький логотип в углу */}
                    {getActivityImageUrl(mainActivity, 'small', 24) && (
                      <img 
                        src={getActivityImageUrl(mainActivity, 'small', 24)}
                        alt={getActivityImageText(mainActivity, 'small')}
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded object-cover border-2 border-[rgba(14,16,29,0.95)]"
                        title={getActivityImageText(mainActivity, 'small')}
                      />
                    )}
                  </>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-xl">💻</span>
                  </div>
                )}
              </div>
              
              {/* Информация об активности */}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">{mainActivity.name}</div>
                {mainActivity.details && (
                  <div className="text-gray-300 text-xs truncate">
                    {mainActivity.details}
                  </div>
                )}
                {mainActivity.state && (
                  <div className="text-gray-400 text-xs truncate">
                    {mainActivity.state}
                  </div>
                )}
                {mainActivity.timestamps?.start && (
                  <div className="text-[#5865F2] text-xs font-medium">
                    {formatActivityTime(mainActivity.timestamps)} elapsed
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div 
                className={`w-3 h-3 ${getStatusColor(discordData.status)} rounded-full`}
                animate={discordData.status === 'online' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="text-gray-400 text-sm">
                No activity detected
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-2 left-2 w-16 h-16 bg-gradient-to-br from-[#5865F2]/5 to-purple-600/5 rounded-full blur-lg pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-br from-purple-500/5 to-violet-600/5 rounded-full blur-md pointer-events-none" />
      
      {/* Светящиеся точки */}
      <motion.div 
        className="absolute top-4 right-8 w-1 h-1 bg-[#5865F2] rounded-full"
        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-4 left-8 w-0.5 h-0.5 bg-purple-400 rounded-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </motion.div>
  )
}
