import React, { useContext, useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { MusicContext } from '../context/MusicContext'
import { formatTime } from '../utils/formatTime'

export default function MusicPlayer() {
  const { playlist, currentIndex, setCurrentIndex } = useContext(MusicContext)
  const soundRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.1) // Громкость по умолчанию 10%
  const rafRef = useRef(null)

  useEffect(() => {
    // when currentIndex changes, load new track
    if (currentIndex == null || !playlist[currentIndex]) return
    if (soundRef.current) soundRef.current.unload()
    const src = playlist[currentIndex].src
    soundRef.current = new Howl({ 
      src: [src], 
      html5: true, 
      volume: volume,
      onload: () => setDuration(soundRef.current.duration()) 
    })
    setPlaying(false)
    setPos(0)
    return () => { if (soundRef.current) soundRef.current.unload() }
  }, [currentIndex, playlist, volume])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Обновляем громкость при изменении
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume)
    }
  }, [volume])

  const tick = () => {
    if (!soundRef.current) return
    const s = soundRef.current.seek() || 0
    setPos(s)
    rafRef.current = requestAnimationFrame(tick)
  }

  const toggle = () => {
    if (!soundRef.current) return
    if (playing) {
      soundRef.current.pause(); setPlaying(false); cancelAnimationFrame(rafRef.current)
    } else {
      soundRef.current.play(); setPlaying(true); rafRef.current = requestAnimationFrame(tick)
    }
  }

  const seek = (e) => {
    if (!soundRef.current) return
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; const pct = Math.max(0, Math.min(1, x / rect.width))
    soundRef.current.seek(pct * duration)
    setPos(pct * duration)
  }

  const changeVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const pct = Math.max(0, Math.min(1, x / rect.width))
    setVolume(pct)
  }

  if (!playlist.length) return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-200">Music Player</div>
          <div className="text-sm text-gray-400">No tracks available</div>
        </div>
      </div>
    </div>
  )

  const currentTrack = playlist[currentIndex]

  return (
    <div className="card relative overflow-hidden">
      {/* Фоновое изображение */}
      {currentTrack?.cover && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
          style={{ backgroundImage: `url(${currentTrack.cover})` }}
        />
      )}
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 to-violet-950/60 pointer-events-none" />
      
      {/* Информация о треке с кнопкой play */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm drop-shadow-2xl">{currentTrack?.title || 'No track selected'}</h3>
          <p className="text-gray-200 text-xs drop-shadow-lg">Now Playing</p>
        </div>
        {/* Кнопка play/pause */}
        <button
          onClick={toggle}
          className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-500 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-violet-600 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          {playing ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Прогресс бар */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{formatTime(pos)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div 
          className="h-2 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer group hover:h-3 transition-all duration-200" 
          onClick={seek}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full transition-all duration-200 relative"
            style={{ width: `${(pos / duration) * 100 || 0}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Индикатор воспроизведения */}
      <div className="relative z-10 flex justify-center mb-4">
        {playing ? (
          <div className="flex gap-1.5 items-end">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-violet-400 rounded-full smooth-equalizer"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + i * 0.2}s`,
                  height: `${6 + i * 2}px`
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-1.5 items-end">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gray-600 rounded-full opacity-30"
                style={{ height: `${6 + i * 2}px` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Регулятор громкости */}
      <div className="relative z-10 mt-4">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <div 
            className="flex-1 h-1 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer group hover:h-2 transition-all duration-200" 
            onClick={changeVolume}
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full transition-all duration-200 relative"
              style={{ width: `${volume * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-gray-400 w-8 text-right">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-full blur-lg pointer-events-none" />
    </div>
  )
}