import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function FooterBanner() {
  const { t } = useTranslation()
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="relative mt-12 h-64 rounded-2xl overflow-hidden"
    >
      {/* Фоновое изображение */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/banner.jpg')` // Замени на свою фотку
        }}
      />
      
      {/* Туманный оверлей */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-violet-900/30" />
      
      {/* Анимированный туман */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-24 bg-gradient-to-l from-white/5 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Контент */}
      <div className="relative z-10 h-full flex items-end p-8">
        <div className="text-white">
          <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {t('readyForProjects')}
          </h3>
          <p className="text-gray-300 mb-4">
            {t('letsCreateTogether')}
          </p>
          <div className="space-y-2">
            <div className="text-gray-300 text-sm">{t('contactMe')}</div>
            <div className="flex gap-6 flex-wrap">
              <a 
                href="mailto:contact@sqrlizz.xyz"
                className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                contact@sqrlizz.xyz
              </a>
              <a 
                href="https://t.me/sqrilizz"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                @sqrilizz
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Декоративные частицы */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-white/40 rounded-full animate-ping" />
      <div className="absolute top-12 right-16 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-8 right-24 w-1.5 h-1.5 bg-violet-400/50 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
    </motion.div>
  )
}
