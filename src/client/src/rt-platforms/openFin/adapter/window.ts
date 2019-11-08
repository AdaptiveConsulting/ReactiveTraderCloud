/* eslint-disable no-undef */
import { WindowConfig } from '../../types'
import { get as _get, last as _last } from 'lodash'
import { PlatformWindow } from '../../platformWindow'

const TEAR_OUT_OFFSET_LEFT = 50
const TEAR_OUT_OFFSET_TOP = 50

type DesktopWindowProps = WindowConfig

// TS black magic to get the type for possible window states in Openfin (unfortunately this is not exported in their typing)
type GetState = fin.OpenFinWindow['getState']
type GetStateCallback = Required<Parameters<GetState>>[0]
type WindowStateArr = Parameters<GetStateCallback>
type WindowState = WindowStateArr[keyof WindowStateArr]

export const openfinWindowStates: { readonly [key: string]: WindowState } = {
  Normal: 'normal',
  Minimized: 'minimized',
  Maximized: 'maximized',
}

const generateRandomName = function() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

const getChildWindows = () => {
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

//TODO: move to openfin V2 version (based on promises) once they fix their bug related to getting current window
// (in V2 call to ofWindow.getWebWindow() returns undefined - thus we are forced to use old callback APIs)
export function createPlatformWindow(getWindow: () => Promise<fin.OpenFinWindow>): PlatformWindow {
  return {
    getNativeWindow: async () => {
      const w = await getWindow()
      return w.getNativeWindow()
    },
    close: async () => (await getWindow()).close(),
    bringToFront: async () => (await getWindow()).bringToFront(),
    minimize: async () => (await getWindow()).minimize(),
    maximize: async () => {
      const window = await getWindow()
      window.getState((state: WindowState) => {
        switch (state) {
          case openfinWindowStates.Maximized:
          case openfinWindowStates.Minimized:
            window.restore(() => window.bringToFront())
            break
          case openfinWindowStates.Normal:
          default:
            window.maximize()
            break
        }
      })
    },
    restore: async () => (await getWindow()).restore(),
  }
}

export const openDesktopWindow = async (
  config: DesktopWindowProps,
  onClose?: () => void,
  position?: {},
): Promise<PlatformWindow> => {
  const { url, width: defaultWidth, height: defaultHeight, maxHeight, maxWidth } = config
  const minWidth = config.minWidth ? config.minWidth : 100
  const minHeight = config.minHeight ? config.minHeight : 100

  const childWindows = await getChildWindows()
  const hasChildWindows = childWindows && childWindows.length > 0
  const shouldBeDefaultCentered = !hasChildWindows && (!config.x && !config.y)

  let updatedPosition = {
    defaultLeft: config.x ? config.x : undefined,
    defaultTop: config.y ? config.y : undefined,
  }
  if (hasChildWindows) {
    const lastWindow = _last(childWindows)
    updatedPosition = {
      defaultLeft: _get(lastWindow, 'nativeWindow.screenLeft') + TEAR_OUT_OFFSET_LEFT,
      defaultTop: _get(lastWindow, 'nativeWindow.screenTop') + TEAR_OUT_OFFSET_TOP,
    }
  }

  //TODO: move to openfin V2 version (based on promises) once they fix their bug related to getting current window
  // (in V2 call to ofWindow.getWebWindow() returns undefined - thus we are forced to use old callback APIs)
  const ofWindowPromise = new Promise<fin.OpenFinWindow>(resolve => {
    const win = new fin.desktop.Window(
      {
        name: config.name || generateRandomName(),
        url,
        defaultWidth,
        defaultHeight,
        minWidth,
        minHeight,
        maxHeight,
        maxWidth,
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
          const closeListener = () => {
            win.removeEventListener('closed', closeListener)
            onClose && onClose()
          }
          win.addEventListener('closed', closeListener)
        }
        resolve(win)
      },
      error => {
        console.log('Error creating window:', error)
      },
    )
  })

  return createPlatformWindow(() => ofWindowPromise)
}
