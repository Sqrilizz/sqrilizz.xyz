import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function TerminalCard({ user, children }) {
  const { t } = useTranslation()
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-[#060611] p-6 rounded-2xl border border-[rgba(90,89,185,0.12)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-auto text-xs text-gray-400">~/about-me</div>
      </div>
      <div className="font-mono text-sm text-gray-200 relative">
        {children}
        {/* Анимированный курсор */}
        <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"></span>
      </div>
      <div className="mt-4">
        <div className="bg-[rgba(36,37,75,0.6)] border border-[rgba(90,89,185,0.4)] p-3 rounded">{t('openProjects')}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 rounded-sm overflow-hidden shadow-sm">
            <svg viewBox="0 0 990 630" className="w-full h-full">
              <rect width="990" height="210" fill="#0072CE"/>
              <rect y="210" width="990" height="210" fill="#000000"/>
              <rect y="420" width="990" height="210" fill="#FFFFFF"/>
            </svg>
          </div>
          <div><div className="text-[13px] text-gray-400">{t('country')}</div><div className="font-medium">{user.location.country}</div></div>
        </div>
        <div className="flex items-center gap-2"><span>🏙️</span><div><div className="text-[13px] text-gray-400">{t('city')}</div><div className="font-medium">{user.location.city}</div></div></div>
      </div>
    </motion.div>
  )
}