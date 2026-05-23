import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  SiArchlinux, SiKde, SiZedindustries, SiVscodium, SiGit, SiDocker,
  SiBrave, SiNotion, SiTelegram, SiSteam,
  SiTypescript, SiPython, SiRust, SiJavascript, SiGnubash, SiNvidia
} from 'react-icons/si'
import { FaJava, FaLaptop, FaMicrochip, FaMemory, FaHdd, FaTablet, FaDatabase } from 'react-icons/fa'

const hardware = [
  { icon: FaLaptop, name: 'ASUS TUF Gaming', href: 'https://www.asus.com/uk/laptops/for-gaming/tuf-gaming/2021-asus-tuf-gaming-f15/' },
  { icon: FaMicrochip, name: 'i5-11400H' },
  { icon: SiNvidia, name: 'RTX 3050' },
  { icon: FaMemory, name: '16 GB DDR4' },
  { icon: FaHdd, name: 'NVMe SSD' },
  { icon: FaTablet, name: 'Kindle 10th Gen' },
]

const software = [
  { icon: SiArchlinux, name: 'Arch Linux' },
  { icon: SiKde, name: 'KDE' },
  { icon: SiZedindustries, name: 'Zed' },
  { icon: SiVscodium, name: 'VS Code' },
  { icon: SiGit, name: 'Git' },
  { icon: SiDocker, name: 'Docker' },
  { icon: SiBrave, name: 'Brave' },
  { icon: SiNotion, name: 'Notion' },
  { icon: SiTelegram, name: 'Telegram' },
  { icon: SiSteam, name: 'Steam' },
]

const languages = [
  { icon: SiTypescript, name: 'TypeScript' },
  { icon: SiPython, name: 'Python' },
  { icon: SiRust, name: 'Rust' },
  { icon: FaJava, name: 'Java' },
  { icon: FaDatabase, name: 'SQL' },
  { icon: SiGnubash, name: 'Bash' },
  { icon: SiJavascript, name: 'JavaScript' },
]

export default function SetupSection() {
  const { t } = useTranslation()

  const categories = [
    { title: t('setupHardware'), items: hardware },
    { title: t('setupSoftware'), items: software },
    { title: t('setupLanguages'), items: languages },
  ]

  return (
    <section id="setup" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {t('setupTitle')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: ci * 0.08 }}
            >
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-4">{cat.title}</p>
              <div className="space-y-2">
                {cat.items.map((item, i) => {
                  const Tag = item.href ? 'a' : 'div'
                  const linkProps = item.href ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' } : {}
                  return (
                    <Tag
                      key={i}
                      {...linkProps}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/50 ${item.href ? 'hover:border-zinc-700 hover:bg-zinc-900/60 transition-all cursor-pointer' : ''}`}
                    >
                      <item.icon className="text-zinc-500 flex-shrink-0" size={15} />
                      <span className="text-zinc-300 text-sm">{item.name}</span>
                    </Tag>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
