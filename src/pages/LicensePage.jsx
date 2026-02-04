import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaArrowLeft,
  FaShieldAlt,
  FaCode,
  FaExclamationTriangle,
} from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-60 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-block mb-8">
          <motion.span
            whileHover={{ x: -6 }}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <FaArrowLeft size={14} />
            Back to Home
          </motion.span>
        </Link>

        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent inline-block relative">
            License
            <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-zinc-700 to-transparent" />
          </h1>
          <p className="text-zinc-500 mt-4">
            Terms and conditions for using software and digital products
          </p>
        </motion.header>

        <motion.main
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800/50 shadow-lg space-y-10"
        >
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FaShieldAlt className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Sqrilizz Custom License (SCL)
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-zinc-400 leading-relaxed">
                This license applies to all mods, plugins, libraries, applications,
                tools, services, and other software products created, published,
                or distributed under the names <strong className="text-zinc-300">Sqrilizz</strong>,{' '}
                <strong className="text-zinc-300">Sqrilizz Entertainment</strong>, and{' '}
                <strong className="text-zinc-300">AuryxStudio</strong> (a subsidiary company).
              </p>

              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <p className="text-zinc-400 text-sm">
                  <strong className="text-zinc-300">Important:</strong> By downloading, installing, copying, modifying, or otherwise using
                  any of the Software, you agree to comply with the terms of this
                  license. If you do not agree, you must not use the Software.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <FaCode className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Permissions</h3>
            </div>

            <ul className="space-y-3 text-zinc-400">
              <li className="flex gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Use the Software for personal purposes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Run the Software on public servers, including monetized servers with donations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Modify the source code for private use</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>
                  Include the Software in free modpacks with proper attribution
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>
                  Create content (videos, streams, articles) featuring the Software
                </span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <FaExclamationTriangle className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Restrictions</h3>
            </div>

            <ul className="space-y-3 text-zinc-400">
              <li className="flex gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>
                  <strong className="text-zinc-300">Sell or resell</strong> the Software itself or any modified versions
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>
                  Create and sell <strong className="text-zinc-300">derivative products</strong> based on the Software's code
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>
                  Use the Software's code in <strong className="text-zinc-300">paid mods, plugins, or commercial software</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>
                  Include the Software in <strong className="text-zinc-300">paid modpacks or premium content bundles</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>
                  Redistribute the Software or modified versions without explicit written permission
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>Claim authorship or ownership of the Software</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>
                  Remove or modify copyright, license notices, or attribution
                </span>
              </li>
            </ul>

            <div className="mt-6 bg-red-500/5 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-zinc-400">
                <strong className="text-red-400">Important:</strong> While you may use the Software on monetized servers (with donations/passes), 
                you are strictly prohibited from selling the Software itself, creating paid products based on its code, 
                or using it in any commercial software without explicit written permission from the author.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-4">
              Attribution Requirements
            </h3>

            <p className="text-zinc-400 mb-3">
              When using the Software in modpacks, servers, or content, please provide attribution:
            </p>

            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <pre className="bg-zinc-900/50 rounded p-3 font-mono text-sm text-zinc-300 whitespace-pre-wrap overflow-x-auto">
{`Created by Sqrilizz
Sqrilizz Entertainment / AuryxStudio
Website: https://sqrilizz.xyz
GitHub: https://github.com/Sqrilizz
Modrinth: https://modrinth.com/user/Sqrilizz`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-4">Disclaimer</h3>
            <p className="text-zinc-400 leading-relaxed">
              The Software is provided “AS IS”, without warranty of any kind.
              The Author and affiliated entities shall not be held liable for
              any damage, data loss, security issues, or financial loss arising
              from the use of the Software.
            </p>
          </section>

          <section className="border-t border-zinc-800 pt-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Commercial Use & Special Permissions
            </h3>

            <p className="text-zinc-400 mb-4">
              If you wish to create commercial products based on the Software, including:
            </p>

            <ul className="space-y-2 text-zinc-400 mb-4 ml-4">
              <li className="flex gap-2">
                <span>•</span>
                <span>Selling the Software or modified versions</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Creating paid plugins/mods using the Software's code</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Including in paid modpacks or premium bundles</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Using in commercial software products</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Redistribution or resale in any form</span>
              </li>
            </ul>

            <p className="text-zinc-400 mb-4">
              You <strong className="text-zinc-300">must obtain explicit written permission</strong> from the author. Contact:
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://sqrilizz.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Website
              </a>
              <a
                href="https://github.com/Sqrilizz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://t.me/sqrilizz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Telegram
              </a>
              <a
                href="https://modrinth.com/user/Sqrilizz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Modrinth
              </a>
            </div>
          </section>

          <footer className="pt-6 border-t border-zinc-800 text-center space-y-2">
            <p className="text-sm text-zinc-600">
              © {new Date().getFullYear()} Sqrilizz · Sqrilizz Entertainment · AuryxStudio
            </p>
            <p className="text-xs text-zinc-700">
              All rights reserved · Last updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </footer>
        </motion.main>
      </div>
    </div>
  )
}
