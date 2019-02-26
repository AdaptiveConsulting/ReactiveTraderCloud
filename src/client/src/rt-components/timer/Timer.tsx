import { useEffect } from 'react'
import { RequireOnlyOne } from 'rt-util'

interface Props {
  duration: number
  immediate?: boolean
  timeout: () => unknown
  interval: () => unknown
}

export type TimerProps = RequireOnlyOne<Props, 'timeout' | 'interval'>

export const Timer: React.FC<TimerProps> = ({ interval, timeout, duration, immediate }) => {
  useEffect(() => {
    const id = interval ? window.setInterval(interval, duration) : window.setTimeout(timeout, duration)
    if (immediate) {
      ;(interval || timeout)()
    }
    return () => {
      const clearFn = interval ? clearInterval : clearTimeout
      clearFn(id)
    }
  }, [duration, immediate])

  return null
}

export default Timer
