import { motion } from 'framer-motion'
import { FaCode, FaDownload, FaStar } from 'react-icons/fa'

const stats = [
  { icon: FaCode, value: '50+', label: 'Projects', color: 'text-purple-400' },
  { icon: FaDownload, value: '10K+', label: 'Downloads', color: 'text-blue-400' },
  { icon: FaStar, value: '500+', label: 'Stars', color: 'text-yellow-400' }
]

export default function StatsCard() {
  return (
    <div className="h-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-around">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ x: 5 }}
        >
          <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
