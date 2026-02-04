import { Analytics } from '@vercel/analytics/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MusicProvider } from './context/MusicContext'
import { SettingsProvider } from './context/SettingsContext'
import BentoLayout from './components/bento/BentoLayout'
import FavoritesPage from './pages/FavoritesPage'
import LicensePage from './pages/LicensePage'
import CrimePage from './pages/CrimePage'
import DonatePage from './pages/DonatePage'
import './i18n'

export default function App() {
  return (
    <SettingsProvider>
      <MusicProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BentoLayout />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/license" element={<LicensePage />} />
            <Route path="/crime" element={<CrimePage />} />
            <Route path="/donate" element={<DonatePage />} />
          </Routes>
        </Router>
        <Analytics />
      </MusicProvider>
    </SettingsProvider>
  )
}
