import { useState, useEffect } from 'react'

export function useAge(birthDate) {
  const [age, setAge] = useState(0)

  useEffect(() => {

    const birth = new Date(birthDate + 'T00:00:00+02:00')
    
    const calculateAge = () => {
      const now = new Date()
      const diffInMs = now - birth
      const ageInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25)
      return ageInYears
    }
    setAge(calculateAge())
    const interval = setInterval(() => {
      setAge(calculateAge())
    }, 100)

    return () => clearInterval(interval)
  }, [birthDate])

  return age
}