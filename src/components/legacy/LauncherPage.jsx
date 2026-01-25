import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import StarField from './StarField'

export default function LauncherPage() {
  const features = [
    {
      icon: '🎨',
      title: 'Purple-themed UI',
      description: 'Beautiful violet color scheme (#764AAC) with custom SVG icons'
    },
    {
      icon: '🚫',
      title: 'No Ads',
      description: 'Clean experience without any advertisements'
    },
    {
      icon: '🔐',
      title: 'Flexible Authentication',
      description: 'Use official Microsoft accounts or offline accounts'
    },
    {
      icon: '💬',
      title: 'Discord Rich Presence',
      description: 'Dynamic status, in-game timer, and clickable buttons'
    },
    {
      icon: '⚡',
      title: 'Optimized Performance',
      description: 'Lightweight package with integrated update fetcher'
    },
    {
      icon: '👤',
      title: 'Ely.by Integration',
      description: 'Official account skin system and AuthLib support'
    }
  ]

  const downloads = [
    {
      platform: 'Windows',
      icon: '🪟',
      extension: '.exe',
      notes: 'Supported on Windows 10/11',
      color: 'from-blue-600 to-blue-500',
      url: 'https://www.sqrilizz.fun/api/file-download?id=kHkA0Evsy__Ym4iGC2fSo',
      available: true
    },
    {
      platform: 'Linux (DEB)',
      icon: '🐧',
      extension: '.deb',
      notes: 'For Debian/Ubuntu based distributions',
      color: 'from-orange-600 to-orange-500',
      url: 'https://www.sqrilizz.fun/api/file-download?id=tUvNhFxQ4Y-BG1P0ZSNtU',
      available: true
    },
    {
      platform: 'Linux (RPM)',
      icon: '🐧',
      extension: '.rpm',
      notes: 'For Fedora/RHEL based distributions',
      color: 'from-red-600 to-red-500',
      url: 'https://www.sqrilizz.fun/api/file-download?id=zQ50M1zXZMAY0PAmAjenK',
      available: true
    },
    {
      platform: 'Linux (AppImage)',
      icon: '🐧',
      extension: '.appimage',
      notes: 'Universal Linux package',
      color: 'from-green-600 to-green-500',
      url: '#',
      available: false
    },
    {
      platform: 'macOS',
      icon: '🍎',
      extension: '.dmg',
      notes: 'Works on Ventura, Sonoma, Sequoia, Tahoe',
      color: 'from-gray-600 to-gray-500',
      url: '#',
      available: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b15] to-[#01010e] text-gray-100 relative overflow-hidden">
      <StarField />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-bold mb-4"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600">
                Sqrilizz Launcher
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-6"
            >
              Your Ultimate Minecraft Companion
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 max-w-3xl mx-auto"
            >
              A powerful Minecraft launcher based on Modrinth's Theseus core, designed to enhance your Minecraft experience with a beautiful purple-themed interface and advanced features.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <a
              href="https://github.com/sqrilizz/SqrilizzLauncher/releases"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Latest
            </a>
            <a
              href="https://github.com/sqrilizz/SqrilizzLauncher"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-lg border border-purple-500/30 text-gray-200 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">
            ✨ Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="card hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Download Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">
            📥 Download
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((download, index) => (
              <motion.a
                key={index}
                href={download.available ? download.url : undefined}
                onClick={!download.available ? (e) => e.preventDefault() : undefined}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={download.available ? { scale: 1.05 } : {}}
                className={`card text-center transition-all duration-300 ${
                  download.available 
                    ? 'cursor-pointer hover:shadow-xl hover:shadow-purple-500/20' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="text-5xl mb-4">{download.icon}</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">{download.platform}</h3>
                <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${download.color} text-white font-mono text-sm mb-3`}>
                  {download.extension}
                </div>
                <p className="text-xs text-gray-400 mb-2">{download.notes}</p>
                {!download.available && (
                  <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                    Coming Soon
                  </span>
                )}
              </motion.a>
            ))}
          </div>
          <p className="text-center text-gray-400 mt-6 text-sm">
            Visit the <a href="https://github.com/sqrilizz/SqrilizzLauncher/releases" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline">releases page</a> to download the correct version for your system
          </p>
        </motion.div>

        {/* Getting Started */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">
            🚀 Getting Started
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 flex items-center justify-center font-bold">1</span>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-1">Download Latest Release</h4>
                    <p className="text-sm text-gray-400">Go to the releases page and choose the file for your operating system</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 flex items-center justify-center font-bold">2</span>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-1">Log in or Create Account</h4>
                    <p className="text-sm text-gray-400">Use your official Microsoft account (MSA), or create an offline account</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 flex items-center justify-center font-bold">3</span>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-1">Launch Minecraft</h4>
                    <p className="text-sm text-gray-400">Start Minecraft from the launcher. The launcher will auto-detect the recommended JVM version</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Support Channels */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">
            💬 Support
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://t.me/sqrilizz"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-2xl">📱</span>
              <span>Telegram</span>
            </a>
            <a
              href="https://sqrilizz.xyz"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-2xl">🌐</span>
              <span>Website</span>
            </a>
            <a
              href="https://github.com/sqrilizz/SqrilizzLauncher"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-2xl">💻</span>
              <span>GitHub</span>
            </a>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="card border border-yellow-500/30 bg-yellow-500/5">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <span>⚠️</span>
              Disclaimer
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• Sqrilizz Launcher is intended <strong>solely for educational and experimental use</strong></p>
              <p>• We <strong>do not condone piracy</strong> — users are encouraged to purchase a legitimate Minecraft license</p>
              <p>• Respect all relevant licensing agreements and support Minecraft developers</p>
            </div>
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-12 text-gray-400 text-sm"
        >
          <p>Based on <a href="https://modrinth.com/" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline">Modrinth</a> and <a href="https://github.com/modrinth/code" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline">Theseus</a></p>
          <p className="mt-2">Special thanks to the Modrinth team for their amazing work!</p>
        </motion.div>
      </div>
    </div>
  )
}
