import { motion } from 'framer-motion'
import { FaGithub, FaTelegram, FaDiscord, FaGlobe } from 'react-icons/fa'
import { SiModrinth } from 'react-icons/si'
import { useState, useEffect } from 'react'
import { useAge } from '../../hooks/useAge'

export default function HeroCard() {
  const [avatar, setAvatar] = useState('/avatar.png')
  const [showCopied, setShowCopied] = useState(false)
  const [discordStatus, setDiscordStatus] = useState('offline')
  const age = useAge('2011-07-09')

  const handleDiscordClick = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('sqrilizz')
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }
  const statusConfig = {
    online: { color: '#43b581', label: 'Online', glow: 'rgba(67, 181, 129, 0.3)' },
    idle: { color: '#faa61a', label: 'Idle', glow: 'rgba(250, 166, 26, 0.3)' },
    dnd: { color: '#f04747', label: 'Do Not Disturb', glow: 'rgba(240, 71, 71, 0.3)' },
    offline: { color: '#747f8d', label: 'Offline', glow: 'rgba(116, 127, 141, 0.3)' }
  }

  useEffect(() => {

    const handleDiscordUpdate = (event) => {
      const data = event.detail
      

      if (data.discord_status) {
        setDiscordStatus(data.discord_status)
      }
      

      if (data.discord_user && data.discord_user.avatar) {
        const userId = data.discord_user.id
        const avatarHash = data.discord_user.avatar
        const extension = avatarHash.startsWith('a_') ? 'gif' : 'png'
        setAvatar(`https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=128`)
      }
    }

    window.addEventListener('discord-update', handleDiscordUpdate)
    return () => window.removeEventListener('discord-update', handleDiscordUpdate)
  }, [])

  return (
    <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800/50 relative overflow-hidden group hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated gradient orb */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Avatar & Name */}
        <div className="flex items-start gap-6">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src={avatar} 
              alt="Avatar"
              className="w-20 h-20 rounded-xl border-2 border-zinc-800"
            />
            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-zinc-900"
              style={{ 
                backgroundColor: statusConfig[discordStatus]?.color || statusConfig.offline.color,
              }}
              animate={{ 
                scale: discordStatus === 'online' ? [1, 1.1, 1] : 1,
                boxShadow: discordStatus === 'online' 
                  ? ['0 0 0 0 rgba(67, 181, 129, 0.4)', '0 0 0 4px rgba(67, 181, 129, 0)', '0 0 0 0 rgba(67, 181, 129, 0)']
                  : `0 0 8px ${statusConfig[discordStatus]?.glow || statusConfig.offline.glow}`
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <div className="flex-1">
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Sqrilizz
            </motion.h1>
            <p className="text-zinc-400 mt-2">
              Developer, Telegram enthusiast & AI Engineer
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Tallinn, Estonia</span>
              </div>
              <div className="flex items-center gap-2 relative group/age cursor-default">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="font-mono text-zinc-400">{Math.floor(age)} years old</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-mono text-white opacity-0 group-hover/age:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {age.toFixed(10)} years old
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <motion.div 
          className="my-4 rounded-xl overflow-hidden border border-zinc-800 shadow-lg bg-zinc-900/50"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img 
            src="/banner.jpg" 
            alt="Banner"
            className="w-full h-[140px] object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center')
              const placeholder = document.createElement('div')
              placeholder.className = 'text-zinc-600 text-sm'
              placeholder.textContent = 'No banner'
              e.target.parentElement.appendChild(placeholder)
            }}
          />
        </motion.div>

        {/* Social Links */}
        <div className="flex gap-2 justify-center">
          {[
            { icon: FaGithub, href: 'https://github.com/Sqrilizz' },
            { icon: FaTelegram, href: 'https://t.me/sqrilizz' },
            { icon: FaDiscord, href: '#', onClick: handleDiscordClick },
            { icon: SiModrinth, href: 'https://modrinth.com/user/Sqrilizz' },
            { icon: FaGlobe, href: 'https://sqrilizz.fun' }
          ].map((social, i) => (
            <motion.a
              key={i}
              href={social.href}
              target={social.onClick ? undefined : "_blank"}
              rel={social.onClick ? undefined : "noopener noreferrer"}
              onClick={social.onClick}
              className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <social.icon size={18} />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Copied notification */}
      {showCopied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
        >
          Copied!
        </motion.div>
      )}
    </div>
  )
}
