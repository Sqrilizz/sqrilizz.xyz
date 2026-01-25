import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const commands = [
  { cmd: 'whoami', output: 'Matthew, i am a developer from Estonia' },
  { cmd: 'cat about.txt', output: 'Full-stack developer passionate about creating amazing experiences' },
  { cmd: 'ls skills/', output: 'React  Python  Java  AI  WebDev  Minecraft' },
  { cmd: 'echo $STATUS', output: 'Available for freelance projects' }
]

export default function TerminalCard() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (currentLine >= commands.length) return

    const command = commands[currentLine]
    const fullText = `$ ${command.cmd}\n${command.output}`
    
    if (isTyping && displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1))
      }, 30)
      return () => clearTimeout(timeout)
    } else if (displayedText.length === fullText.length) {
      const timeout = setTimeout(() => {
        setIsTyping(false)
        setTimeout(() => {
          setCurrentLine(prev => (prev + 1) % commands.length)
          setDisplayedText('')
          setIsTyping(true)
        }, 1000)
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [displayedText, currentLine, isTyping])

  return (
    <div className="h-full bg-zinc-900/20 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 font-mono overflow-hidden hover:border-zinc-700 transition-all shadow-lg hover:shadow-xl hover:shadow-zinc-900/50 relative group">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Terminal Content */}
      <div className="text-xs h-full flex flex-col relative z-10">
        <div className="text-zinc-500 mb-2">sqrilizz@portfolio:~</div>
        <pre className="text-zinc-300 whitespace-pre-wrap flex-1">
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1.5 h-3 bg-white ml-0.5"
          />
        </pre>
      </div>
    </div>
  )
}
