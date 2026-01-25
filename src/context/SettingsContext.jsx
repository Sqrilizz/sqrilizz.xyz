import React, { createContext, useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'

export const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const { i18n } = useTranslation()
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [volume, setVolume] = useState(75)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('sqrilizz-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setTheme(settings.theme || 'dark')
        setLanguage(settings.language || 'en')
        setNotifications(settings.notifications ?? true)
        setAnimations(settings.animations ?? true)
        setVolume(settings.volume || 75)
        
        // Apply language
        if (i18n && i18n.changeLanguage) {
          i18n.changeLanguage(settings.language || 'en')
        }
        
        // Apply theme
        applyTheme(settings.theme || 'dark')
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [i18n])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = { theme, language, notifications, animations, volume }
    localStorage.setItem('sqrilizz-settings', JSON.stringify(settings))
  }, [theme, language, notifications, animations, volume])

  const applyTheme = (newTheme) => {
    // Only dark theme supported for now
    const root = document.documentElement
    root.style.setProperty('--bg-primary', '#0a0a0a')
    root.style.setProperty('--bg-secondary', '#1a1a1a')
    root.style.setProperty('--text-primary', '#ffffff')
    root.style.setProperty('--text-secondary', '#a0a0a0')
  }

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const updateLanguage = (newLang) => {
    console.log('Changing language to:', newLang)
    setLanguage(newLang)
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(newLang).then(() => {
        console.log('Language changed successfully to:', newLang)
        // Show notification
        const langNames = {
          en: 'English',
          ru: 'Русский',
          de: 'Deutsch',
          es: 'Español',
          fr: 'Français'
        }
        alert(`Language changed to ${langNames[newLang] || newLang}`)
      }).catch(err => {
        console.error('Failed to change language:', err)
      })
    }
  }

  const value = {
    theme,
    language,
    notifications,
    animations,
    volume,
    setTheme: updateTheme,
    setLanguage: updateLanguage,
    setNotifications,
    setAnimations,
    setVolume,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
