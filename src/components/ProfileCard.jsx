import React from 'react'
import { motion } from 'framer-motion'
import TypewriterText from './TypewriterText'

export default function ProfileCard({ user }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="card hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 bg-[rgba(255,255,255,0.02)] flex items-center justify-center text-xl font-semibold overflow-hidden rounded-xl">
            {/* Замени '/avatar.png' на путь к своему аватару */}
            <img 
              src="https://cdn.discordapp.com/avatars/1401591841115078862/fd0db874af9a33b695c143223e7928f0.png?size=128" 
              alt="sqrilizz"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <span className="hidden w-full h-full flex items-center justify-center">{user.nick.charAt(0).toUpperCase()}</span>
          </div>
          {/* Желтая луна статус */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-[rgba(14,16,29,0.95)] flex items-center justify-center animate-pulse shadow-lg shadow-yellow-400/30">
            <svg className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a6 6 0 0 0 9 5.2A9 9 0 1 1 8.2 3a6 6 0 0 0 3.8 0z"/>
            </svg>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
            <TypewriterText 
              text={user.nick} 
              speed={150} 
              delay={800}
            />
          </h1>
          <p className="text-sm text-gray-300 mt-1">{user.role}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-[rgba(124,58,237,0.08)] pt-4 flex gap-3">
        <a className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(90,89,185,0.12)] hover:bg-[rgba(90,89,185,0.2)] transition-colors" href={user.socials.telegram} target="_blank" rel="noreferrer" title="Telegram">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(90,89,185,0.12)] hover:bg-[rgba(90,89,185,0.2)] transition-colors group relative" 
          onClick={() => {
            navigator.clipboard.writeText('sqrilizz')
            // Показать уведомление
            const btn = event.currentTarget
            const tooltip = btn.querySelector('.tooltip')
            tooltip.classList.remove('opacity-0')
            setTimeout(() => tooltip.classList.add('opacity-0'), 2000)
          }}
          title="Copy Discord ID"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
          </svg>
          <div className="tooltip absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300">
            Copied!
          </div>
        </button>
        <a className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(90,89,185,0.12)] hover:bg-[rgba(90,89,185,0.2)] transition-colors" href={user.socials.github} target="_blank" rel="noreferrer" title="GitHub">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(90,89,185,0.12)] hover:bg-[rgba(90,89,185,0.2)] transition-colors" href={user.socials.instagram} target="_blank" rel="noreferrer" title="Instagram">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(90,89,185,0.12)] hover:bg-[rgba(90,89,185,0.2)] transition-colors" href="/contact" title="Contact Me">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>
      </div>
    </motion.div>
  )
}