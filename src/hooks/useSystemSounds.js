import { useCallback } from 'react'

// Simple sound generator using Web Audio API
const playSound = (frequency, duration, type = 'sine') => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    // Silently fail if audio context is not available
    console.warn('Audio not available:', error)
  }
}

export const useSystemSounds = () => {
  const playWindowOpen = useCallback(() => {
    playSound(800, 0.1, 'sine')
    setTimeout(() => playSound(1000, 0.1, 'sine'), 50)
  }, [])
  
  const playWindowClose = useCallback(() => {
    playSound(1000, 0.1, 'sine')
    setTimeout(() => playSound(800, 0.1, 'sine'), 50)
  }, [])
  
  const playClick = useCallback(() => {
    playSound(600, 0.05, 'square')
  }, [])
  
  const playNotification = useCallback(() => {
    playSound(800, 0.1, 'sine')
    setTimeout(() => playSound(1000, 0.1, 'sine'), 100)
    setTimeout(() => playSound(1200, 0.15, 'sine'), 200)
  }, [])
  
  const playError = useCallback(() => {
    playSound(400, 0.2, 'sawtooth')
  }, [])
  
  return {
    playWindowOpen,
    playWindowClose,
    playClick,
    playNotification,
    playError
  }
}
