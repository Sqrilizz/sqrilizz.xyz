import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaHeart } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function CrimePage() {
  const [threads, setThreads] = useState([])
  const [newThread, setNewThread] = useState({ content: '', name: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  const API_URL = import.meta.env.VITE_GUESTBOOK_API || '/api/guestbook'
  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

  useEffect(() => {
    loadThreads()
  }, [])

  const loadThreads = async () => {
    try {
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error('API unavailable')
      }

      const data = await response.json()
      const messages = data.messages || data || []
      
      const threadsData = messages.map(msg => ({
        id: msg.id,
        content: msg.message,
        timestamp: msg.timestamp,
        likes: msg.likes || 0,
        name: msg.name
      }))
      
      setThreads(threadsData)
      setUseLocalStorage(false)
    } catch (error) {
      console.log('API unavailable, using localStorage')
      setUseLocalStorage(true)
      const saved = localStorage.getItem('crime_threads')
      if (saved) {
        setThreads(JSON.parse(saved))
      }
    }
  }

  const saveToLocalStorage = (newThreads) => {
    localStorage.setItem('crime_threads', JSON.stringify(newThreads))
    setThreads(newThreads)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newThread.name.trim() || !newThread.content.trim()) return
    if (!turnstileToken) {
      alert('Complete captcha')
      return
    }

    const rateLimitKey = 'crime_rate_limit'
    const rateLimitData = JSON.parse(localStorage.getItem(rateLimitKey) || '[]')
    const now = Date.now()
    const threeMinutesAgo = now - 3 * 60 * 1000
    const recentPosts = rateLimitData.filter(timestamp => timestamp > threeMinutesAgo)
    
    if (recentPosts.length >= 1) {
      const timeLeft = Math.ceil((recentPosts[0] + 3 * 60 * 1000 - now) / 60000)
      alert(`Slow down! Wait ${timeLeft} min`)
      return
    }

    setIsSubmitting(true)

    const thread = {
      id: Date.now(),
      name: newThread.name.trim(),
      message: newThread.content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    }

    if (useLocalStorage) {
      const updated = [thread, ...threads]
      saveToLocalStorage(updated)
      setNewThread({ content: '', name: '' })
      setTurnstileToken('')
      localStorage.setItem(rateLimitKey, JSON.stringify([...recentPosts, now]))
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: thread.name,
          message: thread.message,
          turnstileToken
        })
      })

      if (!response.ok) {
        throw new Error('Failed to post')
      }

      localStorage.setItem(rateLimitKey, JSON.stringify([...recentPosts, now]))
      await loadThreads()
      setNewThread({ content: '', name: '' })
      setTurnstileToken('')
    } catch (error) {
      console.error('Failed to post:', error)
      const updated = [thread, ...threads]
      saveToLocalStorage(updated)
      setUseLocalStorage(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (id) => {
    const likedMessages = JSON.parse(localStorage.getItem('guestbook_liked') || '[]')
    if (likedMessages.includes(id)) return

    if (useLocalStorage) {
      const updated = threads.map(t =>
        t.id === id ? { ...t, likes: t.likes + 1 } : t
      )
      saveToLocalStorage(updated)
      localStorage.setItem('guestbook_liked', JSON.stringify([...likedMessages, id]))
      return
    }

    try {
      const response = await fetch(`${API_URL}/like/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === 'Already liked') {
          localStorage.setItem('guestbook_liked', JSON.stringify([...likedMessages, id]))
        }
        throw new Error(error.error || 'Failed to like')
      }

      localStorage.setItem('guestbook_liked', JSON.stringify([...likedMessages, id]))
      const updatedThreads = threads.map(t =>
        t.id === id ? { ...t, likes: t.likes + 1 } : t
      )
      setThreads(updatedThreads)
    } catch (error) {
      console.error('Failed to like:', error)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black p-4 md:p-8 relative overflow-hidden">
      {/* Decorative elements - same as main site */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs with animation */}
        <motion.div 
          className="absolute top-20 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-60 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 bg-zinc-900/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all hover:border-zinc-700 border border-zinc-800/50">
              <FaArrowLeft className="text-sm" />
              <span className="font-medium">back</span>
            </button>
          </Link>
        </motion.div>

        <motion.div 
          className="mb-6 bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-2">/crime/</h1>
            <p className="text-zinc-400 text-sm">anonymous forum • no rules • just vibes</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <input
              type="text"
              placeholder="your name"
              value={newThread.name}
              onChange={(e) => setNewThread({ ...newThread, name: e.target.value })}
              maxLength={50}
              className="w-full px-4 py-3 bg-zinc-800/30 backdrop-blur-sm border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all"
              required
            />
            <textarea
              placeholder="what's on your mind?"
              value={newThread.content}
              onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 bg-zinc-800/30 backdrop-blur-sm border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all resize-none"
              required
            />
            <div className="text-right text-xs text-zinc-500 font-medium">
              {newThread.content.length}/500
            </div>
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken('')}
              onExpire={() => setTurnstileToken('')}
              options={{ theme: 'dark', size: 'normal' }}
            />
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full px-6 py-3 bg-zinc-800/50 border border-zinc-800 text-white font-bold rounded-xl hover:border-zinc-700 hover:bg-zinc-800/70 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'posting...' : 'post message'}
            </button>
          </form>
        </motion.div>

        <div className="space-y-3">
          {threads.map((thread, index) => {
            const likedMessages = JSON.parse(localStorage.getItem('guestbook_liked') || '[]')
            const isLiked = likedMessages.includes(thread.id)
            
            return (
            <motion.div
              key={thread.id}
              className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">{thread.name}</h3>
                    <span className="text-zinc-500 text-xs">{formatDate(thread.timestamp)}</span>
                  </div>
                  <motion.button
                    onClick={() => handleLike(thread.id)}
                    disabled={isLiked}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isLiked 
                        ? 'bg-zinc-800/30 text-zinc-600 cursor-not-allowed border border-zinc-800' 
                        : 'bg-zinc-800/30 text-zinc-400 hover:text-white hover:border-zinc-700 border border-zinc-800'
                    }`}
                    whileHover={!isLiked ? { scale: 1.05 } : {}}
                    whileTap={!isLiked ? { scale: 0.95 } : {}}
                  >
                    <FaHeart className={isLiked ? 'text-red-500' : ''} />
                    <span>{thread.likes}</span>
                  </motion.button>
                </div>
                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{thread.content || thread.message}</p>
              </div>
            </motion.div>
          )})}

          {threads.length === 0 && (
            <motion.div 
              className="text-center py-16 bg-zinc-900/20 backdrop-blur-xl rounded-2xl border border-zinc-800/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-zinc-500 text-lg">no messages yet... be the first!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
