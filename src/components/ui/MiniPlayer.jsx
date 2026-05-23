import { motion } from 'framer-motion'

const TRACK = {
  title: 'Lähen ja tulen',
  artist: 'Põhja-Tallinn',
  embedUrl: 'https://player.mediadelivery.net/embed/668542/760449ec-30c1-4033-86e1-fb466c748311?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
}

export default function MiniPlayer() {
  return (
    <motion.div
      className="rounded-xl bg-zinc-900/50 border border-zinc-800/70 overflow-hidden w-96"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="relative pt-[56.25%] bg-black rounded-t-xl overflow-hidden">
        <iframe
          src={TRACK.embedUrl}
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen"
          allowFullScreen
        />
      </div>

      <div className="px-4 py-3">
        <p className="text-white font-medium truncate text-sm">{TRACK.title}</p>
        <p className="text-zinc-500 text-xs truncate">{TRACK.artist}</p>
      </div>
    </motion.div>
  )
}
