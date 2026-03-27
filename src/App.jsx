import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { MusicProvider } from './context/MusicContext'
import { SettingsProvider } from './context/SettingsContext'
import BentoLayout from './components/bento/BentoLayout'
import './i18n'

export default function App() {
  return (
    <SettingsProvider>
      <MusicProvider>
        <BentoLayout />
        <Analytics />
        <SpeedInsights />
      </MusicProvider>
    </SettingsProvider>
  )
}
