import { motion } from 'framer-motion'
import HeroCard from './HeroCard'
import MusicCard from './MusicCard'
import DiscordCard from './DiscordCard'
import ProjectsCard from './ProjectsCard'
import TerminalCard from './TerminalCard'
import ContactCard from './ContactCard'
import WeatherCard from './WeatherCard'
import VisitorCard from './VisitorCard'

export default function BentoLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black p-4 md:p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs with animation */}
        <motion.div 
          className="absolute top-20 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-60 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-[130px]">
          
          {/* Hero - Large */}
          <motion.div 
            className="row-span-3 md:col-span-3 lg:col-span-3 lg:row-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroCard />
          </motion.div>

          {/* Discord Status */}
          <motion.div 
            className="row-span-1 md:col-span-2 lg:col-span-2 lg:row-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <DiscordCard />
          </motion.div>

          {/* Music Player */}
          <motion.div 
            className="row-span-2 md:col-span-1 lg:col-span-1 lg:row-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MusicCard />
          </motion.div>

          {/* Terminal */}
          <motion.div 
            className="row-span-2 md:col-span-2 lg:col-span-2 lg:row-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TerminalCard />
          </motion.div>

          {/* Weather */}
          <motion.div 
            className="row-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <WeatherCard />
          </motion.div>

          {/* Visitor Counter */}
          <motion.div 
            className="row-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <VisitorCard />
          </motion.div>

          {/* Featured Projects */}
          <motion.div 
            className="row-span-3 md:col-span-3 lg:col-span-4 lg:row-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ProjectsCard />
          </motion.div>

          {/* Contact */}
          <motion.div 
            className="row-span-3 md:col-span-3 lg:col-span-2 lg:row-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ContactCard />
          </motion.div>

        </div>
      </div>
    </div>
  )
}
