import { useState, useEffect } from 'react'
import { fetchDiscordActivity, getDiscordAvatarUrl, getDefaultDiscordAvatarUrl, DISCORD_CONFIG } from '../config/discord'

/**
 * Хук для получения аватара пользователя из Discord через Lanyard API
 * @param {number} size - размер аватара (по умолчанию 128)
 * @returns {Object} { avatarUrl, loading, error, user }
 */
export function useDiscordAvatar(size = 128) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const result = await fetchDiscordActivity(DISCORD_CONFIG.USER_ID)
        
        if (result.success && result.data.user) {
          const discordUser = result.data.user
          setUser(discordUser)
          
          // Пытаемся получить кастомный аватар, если нет - дефолтный
          const customAvatar = getDiscordAvatarUrl(discordUser, size)
          const defaultAvatar = getDefaultDiscordAvatarUrl(discordUser, size)
          
          setAvatarUrl(customAvatar || defaultAvatar)
        } else {
          setError(result.error || 'Failed to fetch Discord data')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAvatar()
    
    // Обновляем аватар каждые 5 минут (на случай если пользователь сменил аватар)
    const interval = setInterval(loadAvatar, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [size])

  return { avatarUrl, loading, error, user }
}
