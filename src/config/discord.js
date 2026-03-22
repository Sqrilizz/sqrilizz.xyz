
export const DISCORD_CONFIG = {

  USER_ID: '1401591841115078862', // Ваш реальный Discord ID
  

  LANYARD_API: 'https://api.lanyard.rest/v1/users/',
  

  LANYARD_WS: 'wss://api.lanyard.rest/socket',
  

  CUSTOM_BANNER: 'https://i.pinimg.com/originals/ed/d8/37/edd83784833878a8bb5bbaa53624da2b.gif', // Замени на свою ссылку
  

}
export const fetchDiscordActivity = async (userId = DISCORD_CONFIG.USER_ID) => {
  try {
    const response = await fetch(`${DISCORD_CONFIG.LANYARD_API}${userId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error('Lanyard API returned error')
    }
    
    return {
      success: true,
      data: {
        status: data.data.discord_status, // online, idle, dnd, offline
        activities: data.data.activities || [],
        listening_to_spotify: data.data.listening_to_spotify || null,
        user: data.data.discord_user,
        active_on_discord_web: data.data.active_on_discord_web,
        active_on_discord_desktop: data.data.active_on_discord_desktop,
        active_on_discord_mobile: data.data.active_on_discord_mobile
      }
    }
  } catch (error) {
    console.error('Failed to fetch Discord activity:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
export class LanyardWebSocket {
  constructor(userId, onUpdate) {
    this.userId = userId
    this.onUpdate = onUpdate
    this.ws = null
    this.heartbeatInterval = null
  }
  
  connect() {
    this.ws = new WebSocket(DISCORD_CONFIG.LANYARD_WS)
    
    this.ws.onopen = () => {
      console.log('Connected to Lanyard WebSocket')

      this.ws.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: this.userId
        }
      }))
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.op) {
        case 1: // Hello
          this.startHeartbeat(data.d.heartbeat_interval)
          break
        case 0: // Event
          if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
            this.onUpdate(data.d)
          }
          break
      }
    }
    
    this.ws.onclose = () => {
      console.log('Disconnected from Lanyard WebSocket')
      this.stopHeartbeat()

      setTimeout(() => this.connect(), 5000)
    }
    
    this.ws.onerror = (error) => {
      console.error('Lanyard WebSocket error:', error)
    }
  }
  
  startHeartbeat(interval) {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ op: 3 }))
      }
    }, interval)
  }
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
  
  disconnect() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
    }
  }
}
export const getMainActivity = (activities) => {
  if (!activities || activities.length === 0) return null
  

  const priorities = {
    'Custom Status': 1,
    'Spotify': 5,
    'Visual Studio Code': 4,
    'Code': 4,
    'WebStorm': 4,
    'IntelliJ IDEA': 4
  }
  
  return activities
    .filter(activity => activity.type !== 4) // Исключаем Custom Status
    .sort((a, b) => (priorities[b.name] || 3) - (priorities[a.name] || 3))[0] || null
}

export const formatActivityTime = (timestamps) => {
  if (!timestamps || !timestamps.start) return null
  
  const elapsed = Date.now() - timestamps.start
  const hours = Math.floor(elapsed / 3600000)
  const minutes = Math.floor((elapsed % 3600000) / 60000)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')} elapsed`
  }
  return `${minutes}:${Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0')} elapsed`
}
export const getDiscordAvatarUrl = (user, size = 64) => {
  if (!user || !user.avatar) return null
  
  const extension = user.avatar.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=${size}`
}
export const getDefaultDiscordAvatarUrl = (user, size = 64) => {
  if (!user) return null
  

  if (user.discriminator === "0") {
    const index = parseInt(user.id) >> 22
    return `https://cdn.discordapp.com/embed/avatars/${index % 6}.png?size=${size}`
  }
  

  const discriminator = parseInt(user.discriminator)
  return `https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png?size=${size}`
}
export const getActivityImageUrl = (activity, type = 'large', size = 64) => {
  if (!activity || !activity.assets) return null
  
  const imageKey = type === 'large' ? activity.assets.large_image : activity.assets.small_image
  if (!imageKey) return null
  

  if (imageKey.startsWith('mp:external/')) {
    const parts = imageKey.split('/')
    const protocolIndex = parts.findIndex(part => part === 'https' || part === 'http')
    
    if (protocolIndex !== -1) {

      const protocol = parts[protocolIndex]
      const urlParts = parts.slice(protocolIndex + 1)
      return `${protocol}://${urlParts.join('/')}`
    }
    
    return null
  }
  

  if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
    return imageKey
  }
  

  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imageKey}.png?size=${size}`
  }
  
  return null
}
export const getActivityImageText = (activity, type = 'large') => {
  if (!activity || !activity.assets) return null
  
  return type === 'large' ? activity.assets.large_text : activity.assets.small_text
}
export const formatDiscordUsername = (user) => {
  if (!user) return 'Unknown User'
  
  const displayName = user.display_name || user.global_name || user.username
  

  if (user.discriminator === "0") {
    return displayName
  }
  

  return `${displayName}#${user.discriminator}`
}
export const getUserTag = (user) => {
  if (!user) return null
  

  if (user.discriminator === "0") {
    return `@${user.username}`
  }
  

  return `#${user.discriminator}`
}
export const getClanBadgeUrl = (user) => {

  if (user?.clan?.badge && user?.clan?.identity_guild_id) {
    return `https://cdn.discordapp.com/clan-badges/${user.clan.identity_guild_id}/${user.clan.badge}.png?size=32`
  }
  

  if (user?.primary_guild?.badge && user?.primary_guild?.identity_enabled && user?.primary_guild?.identity_guild_id) {
    return `https://cdn.discordapp.com/clan-badges/${user.primary_guild.identity_guild_id}/${user.primary_guild.badge}.png?size=32`
  }
  
  return null
}
export const getClanTag = (user) => {

  if (user?.clan?.tag) {
    return user.clan.tag
  }
  

  if (user?.primary_guild?.tag && user?.primary_guild?.identity_enabled) {
    return user.primary_guild.tag
  }
  
  return null
}
export const getAvatarDecorationUrl = (user, size = 64) => {
  if (!user?.avatar_decoration_data?.asset) return null
  
  return `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=${size}`
}
export const getUserBannerUrl = (user, size = 512) => {
  if (!user?.banner) return null
  
  const extension = user.banner.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${extension}?size=${size}`
}
export const getUserBannerColor = (user) => {
  return user?.banner_color || null
}
export const getUserBadges = (user) => {
  if (!user?.public_flags) return []
  
  const badges = []
  const flags = user.public_flags
  

  if (flags & (1 << 0)) badges.push({ name: 'Discord Staff', emoji: '👨‍💼' })
  

  if (flags & (1 << 1)) badges.push({ name: 'Discord Partner', emoji: '🤝' })
  

  if (flags & (1 << 2)) badges.push({ name: 'HypeSquad Events', emoji: '🎉' })
  

  if (flags & (1 << 3)) badges.push({ name: 'Bug Hunter', emoji: '🐛' })
  

  if (flags & (1 << 6)) badges.push({ name: 'HypeSquad Bravery', emoji: '💜' })
  

  if (flags & (1 << 7)) badges.push({ name: 'HypeSquad Brilliance', emoji: '💖' })
  

  if (flags & (1 << 8)) badges.push({ name: 'HypeSquad Balance', emoji: '💚' })
  

  if (flags & (1 << 9)) badges.push({ name: 'Early Supporter', emoji: '⭐' })
  

  if (flags & (1 << 14)) badges.push({ name: 'Bug Hunter Gold', emoji: '🏆' })
  

  if (flags & (1 << 17)) badges.push({ name: 'Verified Bot Developer', emoji: '🔧' })
  

  if (flags & (1 << 22)) badges.push({ name: 'Active Developer', emoji: '⚡' })
  
  return badges
}
