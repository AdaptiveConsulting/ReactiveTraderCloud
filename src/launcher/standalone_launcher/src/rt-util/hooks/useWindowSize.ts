import { useEffect, useState } from 'react'

export interface WindowSize {
  innerHeight: number
  innerWidth: number
  outerHeight: number
  outerWidth: number
}

const RESIZE_EVENT = 'resize'

export function useWindowSize(): WindowSize {
  const initialWindowSize = {
    innerHeight: 0,
    innerWidth: 0,
    outerHeight: 0,
    outerWidth: 0,
  }

  const [windowSize, setWindowSize] = useState<WindowSize>(initialWindowSize)

  function handleResize() {
    setWindowSize({
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth,
    })
  }

  useEffect(() => {
    window.addEventListener(RESIZE_EVENT, handleResize)

    return () => {
      window.removeEventListener(RESIZE_EVENT, handleResize)
    }
  }, [])

  return windowSize
}
