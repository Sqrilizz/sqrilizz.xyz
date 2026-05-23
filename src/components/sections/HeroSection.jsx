import { motion } from 'framer-motion'
import { FaGithub, FaTelegram, FaDiscord, FaGlobe } from 'react-icons/fa'
import { SiModrinth } from 'react-icons/si'
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import WeatherWidget from '../ui/WeatherWidget'
import GitHubGraph from '../ui/GitHubGraph'

const ROLES = ['developer', 'minecraft modder', 'bot builder', 'arch user', 'open source enthusiast']

function useTypingEffect(words, typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) {
  const [display, setDisplay] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]
    let timeout

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, typingSpeed)
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      }, deletingSpeed)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setWordIndex((wordIndex + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return display
}

export default function HeroSection() {
  const { t } = useTranslation()
  const typedRole = useTypingEffect(ROLES)
  const [avatar, setAvatar] = useState('/avatar.png')
  const [showCopied, setShowCopied] = useState(false)
  const [discordStatus, setDiscordStatus] = useState('offline')

  const handleDiscordClick = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('sqrilizz')
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const statusColors = {
    online: '#43b581',
    idle: '#faa61a',
    dnd: '#f04747',
    offline: '#747f8d'
  }

  useEffect(() => {
    const handleDiscordUpdate = (event) => {
      const data = event.detail
      if (data.discord_status) setDiscordStatus(data.discord_status)
      if (data.discord_user?.avatar) {
        const userId = data.discord_user.id
        const hash = data.discord_user.avatar
        const ext = hash.startsWith('a_') ? 'gif' : 'png'
        setAvatar(`https://cdn.discordapp.com/avatars/${userId}/${hash}.${ext}?size=128`)
      }
    }
    window.addEventListener('discord-update', handleDiscordUpdate)
    return () => window.removeEventListener('discord-update', handleDiscordUpdate)
  }, [])

  const socials = [
    { icon: FaGithub, href: 'https://github.com/Sqrilizz', label: 'GitHub' },
    { icon: FaTelegram, href: 'https://t.me/sqrilizz', label: 'Telegram' },
    { icon: FaDiscord, href: '#', onClick: handleDiscordClick, label: 'Discord' },
    { icon: SiModrinth, href: 'https://modrinth.com/user/Sqrilizz', label: 'Modrinth' },
    { icon: FaGlobe, href: 'https://sqrilizz.fun', label: 'sqrilizz.fun' },
  ]

  return (
    <section className="min-h-[85vh] flex items-center px-6">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-start gap-6"
        >
          <div className="relative">
            <img
              src={avatar}
              alt="Matthew"
              className="w-20 h-20 rounded-2xl border border-zinc-800"
            />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[2.5px] border-zinc-950"
              style={{ backgroundColor: statusColors[discordStatus] }}
            />
          </div>

          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Matthew
            </h1>
            <p className="text-violet-400 text-sm font-mono mt-2 h-5">
              {typedRole}<span className="animate-pulse">|</span>
            </p>
            <p className="text-zinc-400 text-lg mt-3 leading-relaxed max-w-lg">
              {t('heroTagline')}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Tallinn, Estonia</span>
            <span className="text-zinc-700 mx-1">·</span>
            <WeatherWidget />
          </div>

          <div className="flex items-center gap-2 relative">
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target={s.onClick ? undefined : '_blank'}
                rel={s.onClick ? undefined : 'noopener noreferrer'}
                onClick={s.onClick}
                className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-all duration-200"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={s.label}
              >
                <s.icon size={17} />
              </motion.a>
            ))}

            {showCopied && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-emerald-400 ml-2"
              >
                copied!
              </motion.span>
            )}
          </div>

          <div className="flex items-start gap-6 w-full">
            <GitHubGraph />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
