import { useEffect, useState } from 'react'

export function useLocalTime(timezone) {
  const [time, setTime] = useState('')
  useEffect(() => {
    function update() {
      const now = new Date()
      const s = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timezone })
      setTime(s)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timezone])
  return time
}
