import React, { createContext, useState, useRef, useEffect } from 'react'

export const MusicContext = createContext(null)

const defaultPlaylist = [
  {
    title: 'You',
    artist: 'Unknown Artist',
    src: '/music/you.mp3',
    cover: '/music/covers/static.png'
  }
]

export function MusicProvider({ children }) {
  const [playlist] = useState(defaultPlaylist)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioRef.current.addEventListener('ended', handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audioRef.current.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && playlist[currentIndex]) {
      audioRef.current.src = playlist[currentIndex].src
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentIndex, playlist])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    nextTrack()
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length)
    setIsPlaying(true)
  }

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length)
    setIsPlaying(true)
  }

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const value = {
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setCurrentIndex
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}