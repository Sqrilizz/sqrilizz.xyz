import { motion } from 'framer-motion'
import { FaDiscord } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DISCORD_CONFIG, getMainActivity, getActivityImageUrl } from '../../config/discord'

export default function DiscordPresence() {
  const { t } = useTranslation()
  const [status, setStatus] = useState('offline')
  const [activity, setActivity] = useState(null)
  const [activityImage, setActivityImage] = useState(null)
  const [spotify, setSpotify] = useState(null)

  useEffect(() => {
    let ws = null
    let heartbeatInterval = null

    const connect = () => {
      ws = new WebSocket(DISCORD_CONFIG.LANYARD_WS)

      ws.onopen = () => {
        ws.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: DISCORD_CONFIG.USER_ID }
        }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        switch (data.op) {
          case 1:
            heartbeatInterval = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }))
            }, data.d.heartbeat_interval)
            break
          case 0:
            if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
              const p = data.d
              setStatus(p.discord_status)

              const mainActivity = getMainActivity(p.activities)
              setActivity(mainActivity)

              if (mainActivity) {
                let imgUrl = getActivityImageUrl(mainActivity, 'large', 128)
                if (imgUrl?.includes('pd.premid.app')) {
                  imgUrl = `https://wsrv.nl/?url=${encodeURIComponent(imgUrl)}&w=128&h=128&fit=cover`
                }
                setActivityImage(imgUrl)
              } else {
                setActivityImage(null)
              }

              setSpotify(p.listening_to_spotify ? p.spotify : null)
              window.dispatchEvent(new CustomEvent('discord-update', { detail: p }))
            }
            break
        }
      }

      ws.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval)
        setTimeout(connect, 5000)
      }

      ws.onerror = () => {}
    }

    connect()
    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval)
      if (ws) ws.close()
    }
  }, [])

  if (!spotify && !activity) {
    return (
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4 flex items-center gap-3">
        <FaDiscord className="text-zinc-600" size={20} />
        <span className="text-sm text-zinc-600">{t('nothingPlaying')}</span>
      </div>
    )
  }

  if (spotify) {
    return (
      <motion.div
        className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="text-green-400 text-xs">{t('listeningSpotify')}</span>
        </div>
        <div className="flex items-center gap-3">
          {spotify.album_art_url && (
            <img src={spotify.album_art_url} alt={spotify.album} className="w-12 h-12 rounded-lg" />
          )}
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{spotify.song}</p>
            <p className="text-zinc-500 text-xs truncate">{spotify.artist}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        {activityImage ? (
          <img src={activityImage} alt={activity.name} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
            <FaDiscord className="text-zinc-600" size={20} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{activity.name}</p>
          {activity.details && <p className="text-zinc-500 text-xs truncate">{activity.details}</p>}
          {activity.state && <p className="text-zinc-600 text-xs truncate">{activity.state}</p>}
        </div>
      </div>
    </motion.div>
  )
}
