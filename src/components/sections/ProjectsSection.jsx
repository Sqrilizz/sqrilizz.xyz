import { motion } from 'framer-motion'
import { FaGithub, FaStar, FaDownload, FaCode, FaCube } from 'react-icons/fa'
import { SiModrinth } from 'react-icons/si'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchAllProjects, formatNumber } from '../../config/projects'

const langColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
}

function ProjectCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-72 rounded-xl bg-zinc-900/40 border border-zinc-800/70 p-4 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-2">
        <img
          src={project.logo}
          alt={project.title}
          className="w-8 h-8 rounded-lg flex-shrink-0"
          onError={(e) => { e.target.src = 'https://github.com/Sqrilizz.png' }}
        />
        <div className="min-w-0">
          <h3 className="text-white font-medium text-sm truncate group-hover:text-violet-300 transition-colors">
            {project.title}
          </h3>
          {project.language && (
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColors[project.language] || '#666' }} />
              {project.language}
            </span>
          )}
        </div>
      </div>
      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-3">
        {project.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-zinc-600">
        {project.stars > 0 && (
          <span className="flex items-center gap-1">
            <FaStar size={10} /> {formatNumber(project.stars)}
          </span>
        )}
        {project.downloads > 0 && (
          <span className="flex items-center gap-1">
            <FaDownload size={9} /> {formatNumber(project.downloads)}
          </span>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          {project.source === 'github' && <FaGithub className="text-zinc-700 group-hover:text-zinc-500 transition-colors" size={13} />}
          {project.hasModrinth && <SiModrinth className="text-zinc-700 group-hover:text-green-500 transition-colors" size={13} />}
        </div>
      </div>
    </a>
  )
}

function MarqueeRow({ items, direction }) {
  const doubled = [...items, ...items]
  const animDir = direction === 'left' ? 'marquee-left' : 'marquee-right'

  return (
    <div className="overflow-hidden mb-3 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] w-full">
      <div className={`flex gap-3 w-max animate-${animDir} hover:[animation-play-state:paused]`}>
        {doubled.map((project, i) => (
          <ProjectCard key={project.title + i} project={project} />
        ))}
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllProjects().then(data => {
      setProjects(data)
      setLoading(false)
    })
  }, [])

  const mid = Math.ceil(projects.length / 2)
  const row1 = projects.slice(0, mid)
  const row2 = projects.slice(mid)

  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0)
  const totalDownloads = projects.reduce((sum, p) => sum + (p.downloads || 0), 0)

  const stats = [
    { icon: FaCode, label: t('repos'), value: projects.length },
    { icon: FaStar, label: t('stars'), value: totalStars },
    { icon: FaDownload, label: t('downloads'), value: totalDownloads },
    { icon: FaCube, label: t('languages'), value: [...new Set(projects.map(p => p.language).filter(Boolean))].length },
  ]

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {t('projectsTitle')}
        </motion.h2>

        {loading ? (
          <p className="text-zinc-600 text-sm">{t('loading')}</p>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
            >
              {stats.map((s, i) => (
                <div key={i} className="rounded-xl bg-zinc-900/40 border border-zinc-800/70 px-4 py-3 flex items-center gap-3">
                  <s.icon className="text-zinc-600" size={14} />
                  <div>
                    <p className="text-white text-lg font-semibold leading-tight">{formatNumber(s.value)}</p>
                    <p className="text-zinc-600 text-[11px]">{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <MarqueeRow items={row1} direction="left" />
            <MarqueeRow items={row2} direction="right" />
          </>
        )}
      </div>
    </section>
  )
}
