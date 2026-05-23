import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { SettingsProvider } from './context/SettingsContext'
import PageLayout from './components/sections/PageLayout'
import './i18n'

export default function App() {
  return (
    <SettingsProvider>
      <PageLayout />
      <Analytics />
      <SpeedInsights />
    </SettingsProvider>
  )
}
