import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { savingGoal, topDonators, donationMethods, calculateTotalDonations } from '../config/donations'

export default function DonatePage() {
  const [copiedAddress, setCopiedAddress] = useState('')

  const getIcon = (type) => {
    switch (type) {
      case 'paypal':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.68H7.72a.483.483 0 01-.477-.558l.265-1.687.63-3.994.04-.22a.805.805 0 01.794-.68h.5c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327a3.7 3.7 0 00-1.032-1.204c.836.622 1.416 1.506 1.632 2.593z"/>
            <path d="M8.105 8.478c.256-1.313.192-2.447-.3-3.327A3.654 3.654 0 006.773 3.947a3.7 3.7 0 00-1.032-1.204C6.577 3.365 7.157 4.249 7.373 5.336c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.68H-4.28a.483.483 0 01-.477-.558l.265-1.687.63-3.994.04-.22a.805.805 0 01.794-.68h.5c3.238 0 5.774-1.314 6.514-5.12z"/>
          </svg>
        )
      case 'bank':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.5 1L0 6v2h23V6l-11.5-5zM2 10v9h2v-9H2zm4 0v9h2v-9H6zm4 0v9h2v-9h-2zm4 0v9h2v-9h-2zm4 0v9h2v-9h-2zm4 0v9h2v-9h-2zM0 20h23v2H0v-2z"/>
          </svg>
        )
      case 'trc20':
        return (
          <svg viewBox="0 0 2000 2000" fill="currentColor" className="w-5 h-5">
            <path d="M1000 0c552.26 0 1000 447.74 1000 1000s-447.76 1000-1000 1000S0 1552.38 0 1000 447.68 0 1000 0z"/>
            <path fill="#fff" d="M1123.42 866.76V718h340.18V491.34H537.28V718H877.5v148.64C601 879.34 393.1 934.1 393.1 999.7s208 120.36 484.4 133.14v476.5h246V1132.8c276.48-12.74 484.48-67.46 484.48-133.1s-208-120.36-484.48-133.1v-.04zm0 225.64v-.12c-6.94.44-42.6 2.58-122 2.58-63.48 0-108.14-1.8-123.88-2.62v.2C633.34 1081.66 451 1039.12 451 988.22S633.36 894.84 877.62 884v166.1c16 1.1 61.76 3.8 124.92 3.8 75.86 0 114-3.16 121-3.8V884c243.8 10.86 425.72 53.44 425.72 104.16s-182 93.32-425.72 104.18v.06z"/>
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        )
    }
  }

  const copyToClipboard = (address, name) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(name)
    setTimeout(() => setCopiedAddress(''), 2000)
  }

  const currentAmount = calculateTotalDonations()
  const progressPercentage = (currentAmount / savingGoal.target) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black p-4 md:p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-60 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 bg-zinc-900/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all hover:border-zinc-700 border border-zinc-800/50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">back</span>
            </button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="mb-6 bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl">
                <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-2">Support My Work</h1>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
              If you like what I do and want to support my projects, you can donate. Every contribution helps!
            </p>
          </div>
        </motion.div>

        {/* Saving Goal - Full Width */}
        <motion.div 
          className="mb-6 bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{savingGoal.title}</h3>
                <p className="text-zinc-400 text-sm">{savingGoal.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {currentAmount.toFixed(0)}{savingGoal.currency}
                </div>
                <div className="text-sm text-zinc-500">
                  of {savingGoal.target}{savingGoal.currency}
                </div>
              </div>
            </div>
            
            <div className="relative h-3 bg-zinc-800/50 rounded-full overflow-hidden mb-2">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-right text-xs text-zinc-500 font-medium">
              {progressPercentage.toFixed(1)}% funded
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Donation Methods - 2 columns */}
          <div className="lg:col-span-2 grid gap-3">
            {donationMethods.map((method, index) => {
              const isCopied = copiedAddress === method.name
              
              return (
                <motion.div
                  key={method.name}
                  className={`bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border ${method.borderColor} hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                >
                  <div className={`absolute inset-0 ${method.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                          {method.icon ? (
                            <img src={method.icon} alt={method.name} className="w-8 h-8" />
                          ) : (
                            getIcon(method.type)
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white">{method.name}</h3>
                      </div>
                      {method.telegramLink ? (
                        <a
                          href={method.telegramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg font-bold text-xs bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-all border"
                        >
                          Contact
                        </a>
                      ) : method.paypalLink ? (
                        <a
                          href={method.paypalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg font-bold text-xs bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-all border"
                        >
                          Donate
                        </a>
                      ) : method.buymeacoffeeLink ? (
                        <a
                          href={method.buymeacoffeeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg font-bold text-xs bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 transition-all border"
                        >
                          Support
                        </a>
                      ) : (
                        <button
                          onClick={() => copyToClipboard(method.address, method.name)}
                          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                            isCopied
                              ? 'bg-green-500/20 border-green-500/50 text-green-400'
                              : `bg-zinc-800/50 border-zinc-800 text-white hover:border-zinc-700 hover:bg-zinc-800/70`
                          } border`}
                        >
                          {isCopied ? '✓ Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                    
                    {!method.hideAddress && (
                      <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-3 border border-zinc-800">
                        {method.recipientName && (
                          <div className="mb-2 pb-2 border-b border-zinc-700/50">
                            <p className="text-zinc-500 text-xs mb-1">Recipient:</p>
                            <p className="text-zinc-200 font-medium text-sm">{method.recipientName}</p>
                          </div>
                        )}
                        <p className="text-zinc-300 font-mono text-xs break-all">{method.address}</p>
                      </div>
                    )}
                    
                    {method.hideAddress && (
                      <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-3 border border-zinc-800">
                        <p className="text-zinc-400 text-sm text-center">{method.address}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Top Supporters - 1 column */}
          <motion.div 
            className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-zinc-800/30 text-2xl font-light italic text-center px-4">
                you can be<br />here too &lt;3
              </p>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Top Supporters
              </h3>
              <div className="space-y-3">
                {topDonators.map((donator, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      {donator.avatar ? (
                        <img 
                          src={donator.avatar} 
                          alt={donator.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-pink-500/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium text-sm">{donator.name}</div>
                        <div className="text-zinc-500 text-xs">{donator.date}</div>
                      </div>
                    </div>
                    <div className="text-pink-400 font-bold text-sm">
                      {donator.amount}{donator.currency}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-zinc-400 text-sm mb-4">
            Thank you for your support! It means a lot to me. ❤️
          </p>
          
          {/* Buy Me a Coffee Button */}
          <motion.a
            href="https://buymeacoffee.com/sqrilizz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-orange-500/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
            </svg>
            <span>Buy me a coffee</span>
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}
