import { WindowConfig } from "./openWindow"

let openPopoutWindows: Window[] = []

export function openWindow(
  config: WindowConfig,
  onClose?: () => void,
): Promise<Window | undefined> {
  const REFERENCE_OFFSET = 50
  const { name, url, width, height, x, y } = config

  // get rid of any windows that are no longer in use (Win proxy refs remain, just need to check "closed" prop)
  openPopoutWindows = openPopoutWindows.filter((window) => !window.closed)

  const prevWindow = openPopoutWindows[openPopoutWindows.length - 1]
  const { left, top } = prevWindow
    ? {
        left: prevWindow.screenX + REFERENCE_OFFSET,
        top: prevWindow.screenY + REFERENCE_OFFSET,
      }
    : {
        left: window.top
          ? window.top.screenX + window.top.outerWidth / 2 - width / 2
          : 0,
        top: window.top
          ? window.top.screenY + window.top.outerHeight / 2 - height / 2
          : 0,
      }

  openPopoutWindows.forEach((window) => {
    window.focus()
  })

  const win = window.open(
    url,
    name,
    toWindowFeatures({
      width,
      height,
      screenX: x ?? left,
      screenY: y ?? top,
    }),
  )

  if (onClose && win) {
    const unloadListener = () => {
      setTimeout(() => {
        if (win.closed) {
          onClose()
        } else {
          // needs to be re-set after window reload
          setUnloadListener()
        }
      }, 100)
    }
    const setUnloadListener = () =>
      win.addEventListener("unload", unloadListener)
    setUnloadListener()
  }

  if (win) {
    openPopoutWindows = openPopoutWindows.concat(win)
  }
  return Promise.resolve(win || undefined)
}

interface WindowFeatures {
  width?: number
  height?: number
  screenX?: number
  screenY?: number
}

function toWindowFeatures(windowFeatures: WindowFeatures) {
  return Object.keys(windowFeatures)
    .reduce<string[]>((features, name) => {
      const value = windowFeatures[name as keyof WindowFeatures]
      features.push(`${name}=${value}`)
      return features
    }, [])
    .join(",")
}
