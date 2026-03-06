import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

export default function VisitorCard() {
  const [visitorCount, setVisitorCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleVisitorCount = (event) => {
      setVisitorCount(event.detail.totalCount || 0)
      setIsLoading(false)
    }

    window.addEventListener('visitorCount', handleVisitorCount)

    // Fallback timeout
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => {
      window.removeEventListener('visitorCount', handleVisitorCount)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 overflow-hidden hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative group">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 text-zinc-400 mb-4">
          <Users className="w-4 h-4" />
          <span className="text-xs font-medium">Visitors</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          {isLoading ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl font-bold text-zinc-500"
            >
              ...
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              {visitorCount.toLocaleString()}
            </motion.div>
          )}
        </div>
        
        <div className="text-xs text-zinc-500 text-center">
          Total site visits
        </div>
      </div>
    </div>
  )
}
