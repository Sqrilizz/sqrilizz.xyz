import React, { createContext, useState } from 'react'

export const MusicContext = createContext(null)

export function MusicProvider({ children }) {
  const [playlist, setPlaylist] = useState([]) // { title, src }
  const [currentIndex, setCurrentIndex] = useState(null)
  const value = { playlist, setPlaylist, currentIndex, setCurrentIndex }
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}