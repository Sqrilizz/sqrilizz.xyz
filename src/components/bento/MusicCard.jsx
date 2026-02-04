import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa'
import { Howl } from 'howler'

const playlist = [
  { 
    title: 'Ты (you)', 
    artist: 'Ksb Muzik', 
    cover: '/music/covers/ksb.banner.png', 
    src: '/music/you.mp3' 
  }
]

export default function MusicCard() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const soundRef = useRef(null)
  const progressInterval = useRef(null)

  const track = playlist[currentTrack]

  // Инициализация и очистка звука
  useEffect(() => {
    // Создаем новый Howl объект при смене трека
    if (soundRef.current) {
      soundRef.current.unload()
    }

    soundRef.current = new Howl({
      src: [track.src],
      html5: true,
      onplay: () => {
        setIsPlaying(true)
        startProgressUpdate()
      },
      onpause: () => {
        setIsPlaying(false)
        stopProgressUpdate()
      },
      onend: () => {
        handleNext()
      },
      onloaderror: (id, error) => {
        console.error('Error loading audio:', error)
      },
      onplayerror: (id, error) => {
        console.error('Error playing audio:', error)
      }
    })

    return () => {
      if (soundRef.current) {
        soundRef.current.unload()
      }
      stopProgressUpdate()
    }
  }, [currentTrack])

  // Обновление прогресса
  const startProgressUpdate = () => {
    stopProgressUpdate()
    progressInterval.current = setInterval(() => {
      if (soundRef.current && soundRef.current.playing()) {
        const seek = soundRef.current.seek()
        const duration = soundRef.current.duration()
        setProgress((seek / duration) * 100)
      }
    }, 100)
  }

  const stopProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
  }

  // Управление воспроизведением
  const togglePlay = () => {
    if (!soundRef.current) return

    if (soundRef.current.playing()) {
      soundRef.current.pause()
    } else {
      soundRef.current.play()
    }
  }

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
    setProgress(0)
  }

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)
    setProgress(0)
  }

  return (
    <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 flex flex-col hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
      {/* Album Cover */}
      <motion.div 
        className="relative w-full aspect-square rounded-xl overflow-hidden mb-3"
        animate={{ scale: isPlaying ? [1, 1.01, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <img 
          src={track.cover} 
          alt={track.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Equalizer bars */}
        {isPlaying && (
          <div className="absolute bottom-3 right-3 flex gap-1 items-end">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{ 
                  height: ['8px', `${12 + i * 4}px`, '8px'] 
                }}
                transition={{ 
                  duration: 0.6 + i * 0.1, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Track Info */}
      <div className="mb-3 flex-shrink-0">
        <h3 className="text-white font-medium text-sm truncate">{track.title}</h3>
        <p className="text-zinc-500 text-xs truncate">{track.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-0.5 bg-zinc-800 rounded-full mb-3 overflow-hidden flex-shrink-0">
        <motion.div 
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <FaStepBackward size={14} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black"
        >
          {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <FaStepForward size={14} />
        </motion.button>
      </div>
      </div>
    </div>
  )
}
