import { motion } from 'framer-motion'
import { FaTelegram, FaEnvelope, FaDiscord } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const contacts = [
  { icon: FaTelegram, label: 'Telegram', value: '@sqrilizz', href: 'https://t.me/sqrilizz' },
  { icon: FaEnvelope, label: 'Email', value: 'contact@sqrlizz.xyz', href: 'mailto:contact@sqrlizz.xyz' },
  { icon: FaDiscord, label: 'Discord', value: 'sqrilizz', href: '#' },
]

export default function ContactSection() {
  const { t } = useTranslation()
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    fetch('/api/visitor')
      .then(r => r.json())
      .then(data => { if (data.success) setVisitorCount(data.totalCount || 0) })
      .catch(() => {})
  }, [])

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {t('contactTitle')}
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-200 group flex-1"
            >
              <c.icon className="text-zinc-600 group-hover:text-white transition-colors duration-200" size={18} />
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-600 uppercase tracking-wider">{c.label}</div>
                <div className="text-sm text-zinc-300 truncate">{c.value}</div>
              </div>
            </a>
          ))}
        </motion.div>

        <motion.p
          className="mt-10 text-sm text-zinc-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {visitorCount > 0 ? visitorCount.toLocaleString() : '...'} {t('visitors')}
        </motion.p>
      </div>
    </section>
  )
}
