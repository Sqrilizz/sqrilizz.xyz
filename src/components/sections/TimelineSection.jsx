import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const events = [
  { year: '2021', key: 'timelineStart' },
  { year: '2022', key: 'timelineMods' },
  { year: '2023', key: 'timelineBots' },
  { year: '2024', key: 'timelineWeb' },
  { year: '2025', key: 'timelineNow' },
]

export default function TimelineSection() {
  const { t } = useTranslation()

  return (
    <section id="timeline" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {t('timelineTitle')}
        </motion.h2>

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />

          <div className="space-y-8">
            {events.map((event, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-5 relative"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="w-[15px] h-[15px] rounded-full bg-zinc-800 border-2 border-zinc-700 flex-shrink-0 mt-0.5 z-10" />
                <div>
                  <span className="text-xs text-zinc-600 font-mono">{event.year}</span>
                  <p className="text-zinc-400 text-sm mt-0.5">{t(event.key)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
