import { Bounds } from 'openfin/_v2/shapes/shapes'
import { useEffect } from 'react'

export async function animateCurrentWindowSize(bounds: Bounds, duration: number = 200) {
  const window = await fin.Window.getCurrent()

  return window.animate(
    {
      size: {
        duration,
        height: bounds.height,
        width: bounds.width,
      },
    },
    {
      tween: 'ease-in-out',
      interrupt: true,
    }
  )
}

export const getCurrentWindowBounds = async () => {
  const window = await fin.Window.getCurrent()
  return window.getBounds()
}

export const closeCurrentWindow = async () => {
  const window = await fin.Window.getCurrent()
  window.close()
}

export const minimiseCurrentWindow = async () => {
  const window = await fin.Window.getCurrent()
  window.minimize()
}

export function useAppBoundReset(bounds: Bounds | undefined) {
  useEffect(() => {
    if (!bounds) {
      return
    }

    const resetAppBound = () => {
      animateCurrentWindowSize({
        ...bounds,
      })
    }
    window.addEventListener('beforeunload', resetAppBound)

    return () => {
      window.removeEventListener('beforeunload', resetAppBound)
    }
  }, [bounds])
}
