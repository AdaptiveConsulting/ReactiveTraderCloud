/* eslint-disable no-undef */
import {WindowConfig} from '../../types'
import {get as _get, last as _last} from 'lodash'
import {PlatformWindow} from '../../platformWindow'
import { _Window } from 'openfin/_v2/api/window/window'

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

const generateRandomName = function () {
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
export function createPlatformWindow(getWindow: () => Promise<fin.OpenFinWindow | _Window>): PlatformWindow {
  return {
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

type OpenfinWindowPosition = Pick<fin.WindowOption, 'defaultLeft' | 'defaultTop'>;

async function getOpenfinWindowPosition(config: DesktopWindowProps, childWindows?: fin.OpenFinWindow[]): Promise<OpenfinWindowPosition> {
  if (typeof config.x !== 'undefined' || typeof config.y !== 'undefined') {
    return {
      defaultLeft: config.x,
      defaultTop: config.y
    }
  }

  if (childWindows && childWindows.length > 0) {
    const lastWindow = _last(childWindows)
    return {
      defaultLeft: _get(lastWindow, 'nativeWindow.screenLeft') + TEAR_OUT_OFFSET_LEFT,
      defaultTop: _get(lastWindow, 'nativeWindow.screenTop') + TEAR_OUT_OFFSET_TOP,
    }
  }

  return {
    defaultLeft: undefined,
    defaultTop: undefined,
  }
}

export const openDesktopWindow = async (
  config: DesktopWindowProps,
  onClose?: () => void,
  position?: {},
): Promise<PlatformWindow> => {
  //@ts-ignore
  const {url, width: defaultWidth, height: defaultHeight, maxHeight, maxWidth} = config
  const childWindows = await getChildWindows()
  //@ts-ignore
  const hasChildWindows = childWindows && childWindows.length > 0
  //@ts-ignore
  const configHasXYCoordinates = typeof config.x !== 'undefined' && typeof config.y !== 'undefined'
  //@ts-ignore
  const updatedPosition = await getOpenfinWindowPosition(config, childWindows)
  const windowName = config.name || generateRandomName();

  console.info(`Creating Openfin window: ${windowName}`);

  //@ts-ignore
  const winIdentity = await fin.Platform.getCurrentSync().createWindow(
    {
        name: windowName,
        defaultWidth,
        defaultHeight,
        minWidth: config.minWidth ? config.minWidth : 100,
        minHeight: config.minHeight ? config.minHeight : 100,
        maxHeight,
        maxWidth,
        url: `${window.location.origin}${url}`,
        defaultCentered: !hasChildWindows && !configHasXYCoordinates,
        autoShow: true,
        frame: false,
        saveWindowState: false,
        shadow: true,
        contextMenu: true,
        ...position,
        ...updatedPosition,
        layout: {},
    }
  );

  const win = await window.fin.Window.wrap(winIdentity);

  if (onClose) {
    const closeListener = () => {
      console.log(`Received 'close' event for Openfin window: ${windowName}`);
      onClose && onClose()
    }

    win.once('closed', closeListener)
  }

  return createPlatformWindow(() => Promise.resolve(win))
}
