import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function StatsCard() {
  const { t } = useTranslation()

  const links = [
    { label: 'sqrilizz.fun', url: 'https://sqrilizz.fun', icon: '🌐' },
    { label: 't.me/estpyro', url: 'https://t.me/estpyro', icon: '💬' }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="card hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      <div className="text-center mb-2">
        <h3 className="text-sm font-semibold text-gray-200">Quick Links</h3>
      </div>

      <div className="space-y-1">
        {links.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-2 p-1.5 rounded bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-105 group"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">{link.icon}</span>
            <span className="text-xs text-gray-300 group-hover:text-purple-300 transition-colors">{link.label}</span>
          </motion.a>
        ))}
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-purple-500/5 to-violet-600/5 rounded-full blur-lg pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-br from-violet-500/5 to-purple-600/5 rounded-full blur-md pointer-events-none" />
    </motion.div>
  )
}
