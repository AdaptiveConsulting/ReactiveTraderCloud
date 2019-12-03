import { Bounds } from 'openfin/_v2/shapes';

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
