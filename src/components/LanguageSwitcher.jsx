import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const toggle = () => i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru')
  return (
    <button onClick={toggle} className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center">🌍</button>
  )
}