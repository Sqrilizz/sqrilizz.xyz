import { lazy, Suspense, useEffect, useState } from 'react'
import PageLayout from './components/sections/PageLayout'
import './i18n'

const Analytics = lazy(() =>
  import('@vercel/analytics/react')
    .then(({ Analytics: Component }) => ({ default: Component }))
    .catch(() => ({ default: () => null }))
)
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react')
    .then(({ SpeedInsights: Component }) => ({ default: Component }))
    .catch(() => ({ default: () => null }))
)

function DeferredMonitoring() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD) return
    const enable = () => setEnabled(true)
    const idle = window.requestIdleCallback?.(enable, { timeout: 5000 })
    const timeout = idle ? null : window.setTimeout(enable, 3000)
    return () => {
      if (idle) window.cancelIdleCallback?.(idle)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  if (!enabled || !import.meta.env.PROD) return null
  return (
    <Suspense fallback={null}>
      <Analytics mode="production" />
      <SpeedInsights />
    </Suspense>
  )
}

export default function App() {
  return (
    <>
      <PageLayout />
      <DeferredMonitoring />
    </>
  )
}
