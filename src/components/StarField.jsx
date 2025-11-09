import React, { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Настройка размера canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Создаем звезды
    const stars = []
    const numStars = 150

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.7 ? '#a855f7' : '#ffffff' // 30% фиолетовых звезд
      })
    }

    // Анимация
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach(star => {
        // Мерцание
        star.opacity += star.twinkleSpeed
        if (star.opacity > 1 || star.opacity < 0.1) {
          star.twinkleSpeed = -star.twinkleSpeed
        }
        
        // Рисуем звезду
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.opacity))
        ctx.fill()
        
        // Добавляем свечение для фиолетовых звезд
        if (star.color === '#a855f7') {
          ctx.shadowColor = '#a855f7'
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}
