import { motion } from 'framer-motion'
import { FaGithub, FaStar } from 'react-icons/fa'
import { SiModrinth } from 'react-icons/si'
import { useState, useEffect, useRef } from 'react'
import { fetchAllProjects, formatNumber } from '../../config/projects'

export default function ProjectsCard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchAllProjects()
      setProjects(data)
      setLoading(false)
    }
    
    loadProjects()
  }, [])

  // Автопрокрутка (вправо)
  useEffect(() => {
    if (!scrollRef.current || loading || isPaused || projects.length === 0) return

    const scrollContainer = scrollRef.current
    let animationFrameId

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += 0.5
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    // Небольшая задержка для инициализации
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scroll)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [loading, isPaused, projects.length])

  if (loading) {
    return (
      <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 flex items-center justify-center shadow-lg">
        <div className="text-zinc-500 text-sm">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 flex flex-col relative overflow-hidden group">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Featured Projects</h2>

      <div 
        className="flex-1 relative -mx-5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto overflow-y-hidden h-full scrollbar-hide items-center px-5"
        >
          {[...projects, ...projects].map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      </div>
    </div>
  )
}

// Компонент карточки проекта
function ProjectCard({ project }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative bg-zinc-800/30 backdrop-blur-sm rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 cursor-pointer group transition-colors flex flex-col min-w-[260px] max-w-[260px] min-h-[190px] max-h-[190px] flex-shrink-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -3 }}
    >
      {/* Logo */}
      <div className="mb-3 flex items-center justify-between">
        <img 
          src={project.logo} 
          alt={project.title}
          className="w-10 h-10 rounded-lg bg-zinc-900 object-cover"
          onError={(e) => {
            e.target.src = 'https://github.com/Sqrilizz.png'
          }}
        />
        <div className="flex gap-2 items-center">
          {project.stars !== undefined && (
            <div className="flex items-center gap-1 text-zinc-500 text-sm">
              <FaStar size={12} />
              <span className="text-xs">{formatNumber(project.stars)}</span>
            </div>
          )}
          <FaGithub className="text-zinc-600 group-hover:text-zinc-400 transition-colors" size={16} />
          {project.hasModrinth && (
            <SiModrinth 
              className="text-zinc-600 hover:text-green-400 transition-colors cursor-pointer" 
              size={16}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(project.modrinthUrl, '_blank')
              }}
            />
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-white font-medium text-sm mb-2">{project.title}</h3>
      <p className="text-zinc-400 text-xs mb-3 line-clamp-2 flex-1">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.tags.slice(0, 2).map((tag, j) => (
          <span 
            key={j}
            className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}
