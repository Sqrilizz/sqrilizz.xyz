import { motion } from 'framer-motion'
import { FaTelegram, FaEnvelope, FaDiscord, FaInstagram } from 'react-icons/fa'

const contacts = [
  { 
    icon: FaTelegram, 
    label: 'Telegram', 
    value: '@sqrilizz',
    href: 'https://t.me/sqrilizz'
  },
  { 
    icon: FaEnvelope, 
    label: 'Email', 
    value: 'contact@sqrlizz.xyz',
    href: 'mailto:contact@sqrlizz.xyz'
  },
  { 
    icon: FaDiscord, 
    label: 'Discord', 
    value: 'sqrilizz',
    href: '#'
  },
  { 
    icon: FaInstagram, 
    label: 'Instagram', 
    value: '@Matve1m0k1',
    href: 'https://instagram.com/Matve1m0k1'
  }
]

export default function ContactCard() {
  return (
    <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 flex flex-col relative overflow-hidden group">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Contact</h2>
      
      <div className="space-y-3 flex-1 flex flex-col justify-center min-h-0">
        {contacts.map((contact, i) => (
          <motion.a
            key={i}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block group flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 3 }}
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800 group-hover:bg-zinc-800/50 group-hover:border-zinc-700 transition-all">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors flex-shrink-0">
                <contact.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-500">{contact.label}</div>
                <div className="text-white text-sm font-medium truncate">{contact.value}</div>
              </div>
              <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-sm flex-shrink-0">
                →
              </div>
            </div>
          </motion.a>
        ))}
      </div>
      </div>
    </div>
  )
}
