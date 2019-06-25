import { WindowConfig } from '../types'
import { last as _last, get as _get } from 'lodash'

const TEAR_OUT_OFFSET_LEFT = 50
const TEAR_OUT_OFFSET_TOP = 50

type DesktopWindowProps = WindowConfig

const generateRandomName = function() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

const returnChildWindows = () => {
  return new Promise<fin.OpenFinWindow[]>((resolve, reject) => {
    fin.desktop.Application.getCurrent().getChildWindows(
      (children: fin.OpenFinWindow[]) => {
        resolve(children)
      },
      (error: string) => {
        reject(error)
      },
    )
  })
}

export const openDesktopWindow = (
  config: DesktopWindowProps,
  onClose?: () => void,
  position?: {},
) => {
  const { url, width: defaultWidth, height: defaultHeight } = config

  return returnChildWindows().then((childWindows: fin.OpenFinWindow[]) => {
    let updatedPosition = {}
    const hasChildWindows = childWindows && childWindows.length > 0
    const shouldBeDefaultCentered = !hasChildWindows

    if (hasChildWindows) {
      const lastWindow = _last(childWindows)
      updatedPosition = {
        defaultLeft: _get(lastWindow, 'nativeWindow.screenLeft') + TEAR_OUT_OFFSET_LEFT,
        defaultTop: _get(lastWindow, 'nativeWindow.screenTop') + TEAR_OUT_OFFSET_TOP,
      }
    }
    return new Promise<Window>(resolve => {
      const win = new fin.desktop.Window(
        {
          name: config.name || generateRandomName(),
          url,
          defaultWidth,
          defaultHeight,
          defaultCentered: shouldBeDefaultCentered,
          autoShow: true,
          frame: false,
          saveWindowState: false,
          shadow: true,
          ...position,
          ...updatedPosition,
        } as any, // any needed because OpenFin does not have correct typings for WindowOptions @kdesai
        () => {
          if (onClose) {
            win.addEventListener('closed', onClose)
          }
          resolve(win.getNativeWindow())
        },
        error => {
          console.log('Error creating window:', error)
        },
      )
    })
  })
}
