import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const GIST_ID = '9fc5edd761eb0ec4d45987faca9d642a'
const GIST_TOKEN = import.meta.env.VITE_GUESTBOOK_TOKEN
const FILE_NAME = 'guestbook.json'
const COOLDOWN_MS = 60000
const LS_KEY = 'guestbook_user'
const LS_LIKES_KEY = 'guestbook_likes'

const EMOJIS = [
  '😀', '😂', '🥲', '😎', '🤓', '🫡', '💀', '👻',
  '🔥', '✨', '💜', '🖤', '❤️', '🫶', '👋', '🤝',
  '👍', '👎', '🎉', '🎮', '💻', '🛠️', '🚀', '⚡',
  '🌙', '☕', '🎵', '🐧', '🦀', '☠️', '🧠', '👀',
]

async function fetchMessages() {
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`)
    const data = await res.json()
    const content = data.files?.[FILE_NAME]?.content
    return content ? JSON.parse(content) : []
  } catch {
    return []
  }
}

async function postMessage(messages) {
  await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GIST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: { [FILE_NAME]: { content: JSON.stringify(messages) } },
    }),
  })
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || null
  } catch {
    return null
  }
}

function saveUser(name, lastPost) {
  localStorage.setItem(LS_KEY, JSON.stringify({ name, lastPost }))
}

export default function GuestbookSection() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [error, setError] = useState('')
  const [nameLocked, setNameLocked] = useState(false)
  const [likedIds, setLikedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_LIKES_KEY)) || [] } catch { return [] }
  })
  const emojiRef = useRef(null)

  useEffect(() => {
    const saved = getSavedUser()
    if (saved?.name) {
      setName(saved.name)
      setNameLocked(true)
    }
    fetchMessages().then(msgs => {
      setMessages(msgs)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim() || sending) return

    const saved = getSavedUser()
    if (saved?.name && saved.name !== name.trim()) {
      setError(t('guestbookNameLocked'))
      return
    }
    if (saved?.lastPost && Date.now() - saved.lastPost < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (Date.now() - saved.lastPost)) / 1000)
      setError(`wait ${wait}s`)
      return
    }

    setError('')
    setSending(true)
    const newMsg = {
      id: Date.now(),
      name: name.trim().slice(0, 30),
      text: text.trim().slice(0, 200),
      date: new Date().toISOString(),
      likes: 0,
    }
    const updated = [newMsg, ...messages].slice(0, 50)
    await postMessage(updated)
    setMessages(updated)
    setText('')
    saveUser(name.trim(), Date.now())
    setNameLocked(true)
    setSending(false)
  }

  const insertEmoji = (emoji) => {
    if (text.length < 200) {
      setText(prev => prev + emoji)
    }
    setShowEmoji(false)
  }

  const handleLike = async (msgId) => {
    if (likedIds.includes(msgId)) return
    const updated = messages.map(m =>
      m.id === msgId ? { ...m, likes: (m.likes || 0) + 1 } : m
    )
    setMessages(updated)
    const newLiked = [...likedIds, msgId]
    setLikedIds(newLiked)
    localStorage.setItem(LS_LIKES_KEY, JSON.stringify(newLiked))
    await postMessage(updated)
  }

  return (
    <section id="guestbook" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {t('guestbook')}
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="rounded-xl bg-zinc-900/40 border border-zinc-800/70 p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => !nameLocked && setName(e.target.value)}
              placeholder={t('guestbookName')}
              maxLength={30}
              disabled={nameLocked}
              className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex gap-3 relative">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('guestbookMessage')}
                maxLength={200}
                className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="px-2 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-lg hover:bg-zinc-700/50 transition-colors"
              >
                😀
              </button>
            </div>
            <button
              type="submit"
              disabled={sending || !name.trim() || !text.trim()}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? '...' : t('guestbookSend')}
            </button>

            <AnimatePresence>
              {showEmoji && (
                <motion.div
                  ref={emojiRef}
                  className="absolute bottom-12 left-0 bg-zinc-900 border border-zinc-800 rounded-xl p-3 grid grid-cols-8 gap-1 z-20 shadow-xl"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
        </motion.form>

        {loading ? (
          <p className="text-zinc-600 text-sm">{t('loading')}</p>
        ) : messages.length === 0 ? (
          <p className="text-zinc-600 text-sm">{t('guestbookEmpty')}</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                className="rounded-xl bg-zinc-900/40 border border-zinc-800/70 px-4 py-3"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.2) }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{msg.name}</span>
                  <span className="text-zinc-700 text-[10px]">{timeAgo(msg.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 text-sm">{msg.text}</p>
                  <button
                    onClick={() => handleLike(msg.id)}
                    disabled={likedIds.includes(msg.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ml-3 flex-shrink-0 ${
                      likedIds.includes(msg.id)
                        ? 'text-pink-400 cursor-default'
                        : 'text-zinc-600 hover:text-pink-400 cursor-pointer'
                    }`}
                  >
                    <span>{likedIds.includes(msg.id) ? '❤️' : '🤍'}</span>
                    {(msg.likes || 0) > 0 && <span>{msg.likes}</span>}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
