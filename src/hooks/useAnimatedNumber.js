import { useEffect, useState } from 'react'

export function useAnimatedNumber(value, duration = 700) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let frameId = 0
    const start = performance.now()
    const initial = displayValue

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplayValue(initial + (value - initial) * eased)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [value])

  return displayValue
}
