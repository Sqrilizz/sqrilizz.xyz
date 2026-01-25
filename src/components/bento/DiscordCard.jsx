import { motion } from 'framer-motion'
import { FaDiscord } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { DISCORD_CONFIG, getMainActivity, getActivityImageUrl } from '../../config/discord'

export default function DiscordCard() {
  const [status, setStatus] = useState('offline')
  const [activity, setActivity] = useState(null)
  const [activityImage, setActivityImage] = useState(null)
  const [spotify, setSpotify] = useState(null)
  const [banner, setBanner] = useState(null)

  useEffect(() => {
    let ws = null
    let heartbeatInterval = null

    const connectWebSocket = () => {
      ws = new WebSocket(DISCORD_CONFIG.LANYARD_WS)

      ws.onopen = () => {
        console.log('Connected to Lanyard WebSocket')
        ws.send(JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: DISCORD_CONFIG.USER_ID
          }
        }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        switch (data.op) {
          case 1: // Hello
            heartbeatInterval = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }))
              }
            }, data.d.heartbeat_interval)
            break

          case 0: // Event
            if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
              const presenceData = data.d
              
              setStatus(presenceData.discord_status)
              setBanner(DISCORD_CONFIG.CUSTOM_BANNER)
              
              const mainActivity = getMainActivity(presenceData.activities)
              setActivity(mainActivity)
              
              if (mainActivity) {
                const imageUrl = getActivityImageUrl(mainActivity, 'large', 128)
                setActivityImage(imageUrl)
              } else {
                setActivityImage(null)
              }
              
              setSpotify(presenceData.listening_to_spotify ? presenceData.spotify : null)
              
              // Dispatch event for avatar update
              window.dispatchEvent(new CustomEvent('discord-update', { 
                detail: presenceData 
              }))
            }
            break
        }
      }

      ws.onclose = () => {
        console.log('Disconnected from Lanyard WebSocket')
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
        }
        setTimeout(connectWebSocket, 5000)
      }

      ws.onerror = (error) => {
        console.error('Lanyard WebSocket error:', error)
      }
    }

    connectWebSocket()

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
      }
      if (ws) {
        ws.close()
      }
    }
  }, [])

  return (
    <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 flex flex-col hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden">
      {/* Banner (если есть) */}
      {banner && (
        <div className="absolute inset-0 z-0">
          <img 
            src={banner} 
            alt="Discord Banner"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/80 to-zinc-900" />
        </div>
      )}

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Discord Logo */}
        <div className="flex items-center mb-3" style={{ marginTop: '-10px', marginLeft: '-10px' }}>
          <FaDiscord size={17} className="text-zinc-500" />
        </div>

        {/* Activity or Spotify */}
        {spotify ? (
          // Spotify Player
          <motion.div 
            className="flex-1 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl p-3 border border-green-500/20 flex flex-col justify-center"
            style={{ marginLeft: '-8px', marginRight: '-8px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="text-green-400 text-xs font-medium">Listening to Spotify</span>
            </div>
            <div className="flex items-center gap-3">
              {spotify.album_art_url && (
                <motion.img 
                  src={spotify.album_art_url} 
                  alt={spotify.album}
                  className="w-12 h-12 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate font-medium">{spotify.song}</p>
                <p className="text-zinc-400 text-xs truncate mt-0.5">{spotify.artist}</p>
                {spotify.album && (
                  <p className="text-zinc-500 text-[10px] truncate mt-0.5">{spotify.album}</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : activity ? (
          // Activity Display
          <motion.div 
            className="flex-1 bg-zinc-800/30 rounded-xl p-3 border border-zinc-800 flex items-center justify-center"
            style={{ marginLeft: '-8px', marginRight: '-8px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 w-full">
              {/* Activity Image */}
              <motion.div 
                className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0 overflow-hidden border border-zinc-800"
                whileHover={{ scale: 1.05 }}
              >
                {activityImage ? (
                  <img 
                    src={activityImage} 
                    alt={activity.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <svg className="w-6 h-6 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{activity.name}</h4>
                {activity.details && (
                  <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{activity.details}</p>
                )}
                {activity.state && (
                  <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{activity.state}</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          // No Activity
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">No activity</span>
          </div>
        )}
      </div>
    </div>
  )
}
