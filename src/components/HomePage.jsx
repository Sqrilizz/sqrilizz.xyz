import React, { useContext, useEffect } from 'react'
import ProfileCard from './ProfileCard'
import TerminalCard from './TerminalCard'
import MusicPlayer from './MusicPlayer'
import DiscordRPC from './MottoCard'
import LanguageSwitcher from './LanguageSwitcher'
import TypewriterText from './TypewriterText'
import StarField from './StarField'
import FooterBanner from './FooterBanner'
import { useLocalTime } from '../hooks/useLocalTime'
import { MusicContext } from '../context/MusicContext'
import { useTranslation } from 'react-i18next'

const USER = {
  nick: 'Sqrilizz',
  role: 'Developer, Minecraft Modder, Web Designer & AI Engineer',
  location: { country: 'Estonia', city: 'Tallinn', timezone: 'Europe/Tallinn' },
  modrinth: 'https://modrinth.com/user/Sqrilizz',
  socials: {
    telegram: 'https://t.me/sqrilizz',
    discord: 'https://discord.com/users/sqrilizz.auryx',
    instagram: 'https://instagram.com/Matve1m0k1',
    github: 'https://github.com/sqrilizz',
    email: 'mailto:contact@sqrlizz.xyz'
  }
}

export default function HomePage() {
  const { t } = useTranslation()
  const time = useLocalTime(USER.location.timezone)
  const { playlist, currentIndex, setPlaylist, setCurrentIndex } = useContext(MusicContext)

  // Загружаем музыку при первом запуске
  useEffect(() => {
    const playlist = [
      { title: 'KSB - Ruinery', src: '/music/KSB_muzic_Ruinery.mp3', cover: '/music/covers/ksb.banner.png' },
      // Добавьте больше треков здесь:
      // { title: 'Track 2', src: '/music/track2.mp3', cover: '/music/covers/track2.jpg' },
    ]
    
    setPlaylist(playlist)
    setCurrentIndex(0) // Автоматически выбираем первый трек
  }, [setPlaylist, setCurrentIndex])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b15] to-[#01010e] text-gray-100 p-6 relative">
      <StarField />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="md:col-span-1 flex flex-col gap-6">
          <ProfileCard user={USER} />
          <MusicPlayer />
          <DiscordRPC />
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <TerminalCard user={USER}>
            <div>
              <div className="mb-2">
                <span className="text-violet-300">$</span> 
                <TypewriterText 
                  text={` ${t('aboutCommand')}`} 
                  speed={80} 
                  delay={1500}
                />
              </div>
              <div className="mb-2">
                <TypewriterText 
                  text={t('aboutDescription')} 
                  speed={50} 
                  delay={3000}
                />
              </div>

              <pre className="bg-[#020214] p-3 rounded mt-3 text-sm">
{`const skills = [
  "Minecraft Dev",
  "Web Dev",
  "AI Integration",
  "Design & Security",
];`}
              </pre>

              <div className="mt-4 flex gap-3 flex-wrap">
                <a className="inline-block px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-violet-500 text-white" href={USER.modrinth} target="_blank" rel="noreferrer">Modrinth</a>
                <a className="inline-block px-4 py-2 rounded border border-[rgba(124,58,237,0.15)] text-gray-200" href={USER.socials.github} target="_blank" rel="noreferrer">GitHub</a>
                <a className="inline-block px-4 py-2 rounded border border-[rgba(124,58,237,0.15)] text-gray-200" href="/contact">Contact</a>
              </div>

              <div className="mt-6 text-sm text-gray-400">{t('musicPlaying')}: <span className="text-gray-200">{playlist[currentIndex]?.title || '—'}</span></div>
              <div className="mt-6 text-xs text-gray-500">{t('localTime')} {time}</div>
            </div>
          </TerminalCard>

        </div>
      </div>

      {/* Баннер внизу */}
      <div className="max-w-6xl mx-auto relative z-10">
        <FooterBanner />
      </div>

      <LanguageSwitcher />
    </div>
  )
}
