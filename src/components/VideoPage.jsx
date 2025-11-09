import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { VIDEO_CONFIG, VIDEO_SETTINGS, getVideoType } from '../config/videos'

export default function VideoPage() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const videoUrl = VIDEO_CONFIG[videoId]
  const videoType = videoUrl ? getVideoType(videoUrl) : null
  const settings = videoType ? VIDEO_SETTINGS[videoType] || VIDEO_SETTINGS.youtube : null

  useEffect(() => {
    if (!videoUrl) {
      navigate('/')
    }
  }, [videoUrl, navigate])

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      navigate('/')
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!videoUrl) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Кнопка закрытия */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        title="Закрыть (ESC)"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Видео */}
      {videoType === 'mp4' ? (
        <video
          src={videoUrl}
          className="w-full h-full object-contain"
          controls={settings?.controls}
          autoPlay={settings?.autoPlay}
          loop={settings?.loop}
          onLoadedData={() => setIsLoading(false)}
        />
      ) : (
        <iframe
          src={videoUrl}
          className="w-full h-full"
          frameBorder="0"
          allow={settings?.allow}
          allowFullScreen={settings?.allowFullScreen}
          onLoad={() => setIsLoading(false)}
        />
      )}

      {/* Информация о горячих клавишах */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm">
        Нажмите ESC для выхода
      </div>
    </div>
  )
}
