import { Bounds } from 'openfin/_v2/shapes'
import { useLayoutEffect } from 'react'

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
    },
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

export const useAppBoundReset = (bounds: Bounds | undefined) => {
  const app = fin.desktop.Application.getCurrent()

  useLayoutEffect(() => {
    if (!bounds) {
      return
    }

    const resetAppBound = () => {
      animateCurrentWindowSize({
        ...bounds,
      })
    }

    app.addEventListener('window-start-load', resetAppBound)

    return () => {
      app.removeEventListener('window-start-load', resetAppBound)
    }
  }, [app, bounds])
}
