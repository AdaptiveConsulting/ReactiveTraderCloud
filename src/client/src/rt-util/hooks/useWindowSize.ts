import { useEffect, useState } from 'react'

export interface WindowSize {
  innerHeight: number
  innerWidth: number
  outerHeight: number
  outerWidth: number
}

const RESIZE_EVENT = 'resize'

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState()

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
