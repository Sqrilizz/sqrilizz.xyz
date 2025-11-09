import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './i18n'
import { MusicProvider } from './context/MusicContext'
import HomePage from './components/HomePage'
import VideoPage from './components/VideoPage'
import ContactPage from './components/ContactPage'
import WishlistPage from './components/WishlistPage'
import WishlistAdmin from './components/WishlistAdmin'

export default function App() {
  return (
    <MusicProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin/wishlist" element={<WishlistAdmin />} />
          <Route path="/:videoId" element={<VideoPage />} />
        </Routes>
      </Router>
    </MusicProvider>
  )
}