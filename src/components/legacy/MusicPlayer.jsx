import React, { useContext, useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { MusicContext } from '../context/MusicContext'
import { formatTime } from '../utils/formatTime'

export default function MusicPlayer() {
  const { playlist, currentIndex, setCurrentIndex } = useContext(MusicContext)
  const soundRef = useRef(null)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.1) // Громкость по умолчанию 10%
  const [isVideo, setIsVideo] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    // when currentIndex changes, load new track
    if (currentIndex == null || !playlist[currentIndex]) return
    
    const currentTrack = playlist[currentIndex]
    const src = currentTrack.src
    
    // Всегда используем только аудио режим (извлекаем аудио из видео или играем аудио файл)
    setIsVideo(false) // Всегда false, так как мы играем только аудио
    setPlaying(false)
    setPos(0)
    
    // Очищаем предыдущий медиа
    if (soundRef.current) {
      soundRef.current.unload()
      soundRef.current = null
    }
    
    // Всегда используем Howler для аудио (извлекает аудио из видео автоматически)
    soundRef.current = new Howl({ 
      src: [src], 
      html5: true, 
      volume: volume,
      onload: () => setDuration(soundRef.current.duration()) 
    })
    
    return () => { 
      if (soundRef.current) soundRef.current.unload()
      if (videoRef.current && typeof videoRef.current.pause === 'function') {
        videoRef.current.pause()
      }
    }
  }, [currentIndex, playlist])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Обновляем громкость при изменении
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.volume = volume
    } else if (soundRef.current) {
      soundRef.current.volume(volume)
    }
  }, [volume, isVideo])

  const tick = () => {
    // Всегда используем только soundRef для отслеживания прогресса
    if (soundRef.current) {
      const currentTime = soundRef.current.seek() || 0
      setPos(currentTime)
      
      // Синхронизируем визуальное видео с аудио (только для видео, не для GIF)
      const currentTrack = playlist[currentIndex]
      if (videoRef.current && currentTrack?.videoUrl && !currentTrack.videoUrl.endsWith('.gif') && playing) {
        const videoDiff = Math.abs(videoRef.current.currentTime - currentTime)
        // Если разница больше 0.5 секунды, синхронизируем
        if (videoDiff > 0.5) {
          videoRef.current.currentTime = currentTime
        }
      }
      
      if (!soundRef.current.paused) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
  }

  const toggle = async () => {
    const currentTrack = playlist[currentIndex]
    
    // Всегда используем только аудио
    if (soundRef.current) {
      if (playing) {
        soundRef.current.pause()
        setPlaying(false)
        cancelAnimationFrame(rafRef.current)
        // Останавливаем визуальное видео (только если это не GIF)
        if (videoRef.current && currentTrack?.videoUrl && !currentTrack.videoUrl.endsWith('.gif')) {
          videoRef.current.pause()
        }
      } else {
        soundRef.current.play()
        setPlaying(true)
        tick() // Запускаем tick сразу
        // Запускаем визуальное видео синхронно (только если это не GIF)
        if (videoRef.current && currentTrack?.videoUrl && !currentTrack.videoUrl.endsWith('.gif')) {
          try {
            // Синхронизируем время перед воспроизведением
            videoRef.current.currentTime = soundRef.current.seek() || 0
            await videoRef.current.play()
          } catch (error) {
            console.error('Visual video play failed:', error)
          }
        }
      }
    }
  }

  const seek = (e) => {
    const currentTrack = playlist[currentIndex]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    const newTime = pct * duration
    
    // Всегда используем только soundRef для перемотки
    if (soundRef.current) {
      soundRef.current.seek(newTime)
      setPos(newTime)
      
      // Синхронизируем визуальное видео если оно есть (только для видео, не для GIF)
      if (videoRef.current && currentTrack?.videoUrl && !currentTrack.videoUrl.endsWith('.gif')) {
        videoRef.current.currentTime = newTime
      }
    }
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
      {/* Визуальное видео или обложка */}
      {currentTrack?.videoUrl ? (
        <>
          {/* Статичная обложка когда не играет */}
          {!playing && currentTrack?.cover && (
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url(${currentTrack.cover})` }}
            />
          )}
          {/* Визуальное видео/GIF */}
          {currentTrack.videoUrl.endsWith('.gif') ? (
            <img
              ref={videoRef}
              src={currentTrack.videoUrl}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
              alt="Visual"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentTrack.videoUrl}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
              loop
              muted // Без звука, так как звук идет из Howler
              playsInline
              crossOrigin="anonymous"
              preload="metadata"
            />
          )}
          {/* Легкий градиент для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </>
      ) : currentTrack?.cover ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
            style={{ backgroundImage: `url(${currentTrack.cover})` }}
          />
          {/* Фоновый градиент */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 to-violet-950/60 pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 to-violet-950/60 pointer-events-none" />
      )}
      
      {/* Информация о треке с кнопками */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm drop-shadow-2xl">{currentTrack?.title || 'No track selected'}</h3>
          <p className="text-gray-200 text-xs drop-shadow-lg">Now Playing</p>
        </div>
        
        {/* Кнопки управления */}
        <div className="flex items-center gap-2">
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