import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const toggleLanguage = async () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    await i18n.changeLanguage(newLang)
  }
  
  return (
    <button 
      onClick={toggleLanguage} 
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.06)] backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 z-50"
      title={`Switch to ${i18n.language === 'ru' ? 'English' : 'Русский'}`}
    >
      <span className="text-lg">
        {i18n.language === 'ru' ? '🇺🇸' : '🇷🇺'}
      </span>
    </button>
  )
}