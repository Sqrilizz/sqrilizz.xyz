import { motion } from 'framer-motion'
import { 
  SiReact, SiJavascript, SiPython, SiTailwindcss, 
  SiNodedotjs, SiMongodb, SiGit, SiDocker,
  SiTypescript, SiVite, SiFramer
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'

const skills = [
  { icon: SiReact, name: 'React' },
  { icon: SiJavascript, name: 'JavaScript' },
  { icon: SiTypescript, name: 'TypeScript' },
  { icon: SiPython, name: 'Python' },
  { icon: FaJava, name: 'Java' },
  { icon: SiTailwindcss, name: 'Tailwind' },
  { icon: SiNodedotjs, name: 'Node.js' },
  { icon: SiMongodb, name: 'MongoDB' },
  { icon: SiGit, name: 'Git' },
  { icon: SiDocker, name: 'Docker' },
  { icon: SiVite, name: 'Vite' },
  { icon: SiFramer, name: 'Framer' }
]

export default function SkillsCard() {
  return (
    <div className="h-full bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-colors">
      <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
      
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            className="group relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="w-full aspect-square rounded-lg bg-zinc-800/50 border border-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:border-zinc-700 transition-colors">
              <skill.icon 
                size={24} 
                className="text-zinc-400 group-hover:text-white transition-colors"
              />
            </div>
            
            {/* Tooltip */}
            <motion.div
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20 border border-zinc-700"
              initial={{ y: -5 }}
              whileHover={{ y: 0 }}
            >
              {skill.name}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
