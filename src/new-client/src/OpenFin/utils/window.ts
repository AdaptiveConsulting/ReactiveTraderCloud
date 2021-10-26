import { Identity } from "openfin/_v2/identity"

interface BasicWindow {
  name: string
  width: number
  height: number
}

export type Offset = [number, number]
const openFinPopupPrefix = "user-generated-popup-"
export const mainOpenFinWindowName = "Reactive-Trader-MAIN" // set in the app.json

function popupNameFor(name: string): string {
  return `${openFinPopupPrefix}${name}`
}

/**
 * Shows an OpenFin Popup, offset from the bottom right corner of the parent window/full screen.
 */
export async function showOpenFinPopup(
  { height, name, width }: BasicWindow,
  [rightOffset, bottomOffset]: Offset,
) {
  const popupWindow = fin.Window.wrapSync({
    uuid: fin.me.uuid,
    name: popupNameFor(name),
  })

  let left = 0,
    top = 0

  /**
   * In both contexts, right & bottom are the screen coordinates of the right & bottom corners of either rectangle.
   * Upon maximizing an OpenFin window, the window bounds are not updated. We query the window state to see if it is
   * maximized, and if so, place the popup on the screen relative to the whole monitor.
   *
   * We show a window by pointing its top-left corner to a pixel
   */

  async function setLeftTopForFullScreenMode() {
    const monitorInfo = await fin.System.getMonitorInfo()
    const { bottom, right } = monitorInfo.primaryMonitor.availableRect

    left = right - width - rightOffset
    top = bottom - height - bottomOffset
  }

  try {
    const thisWindow = await fin.Window.getCurrent()
    const windowState = await thisWindow.getState()

    if (windowState === "maximized") {
      await setLeftTopForFullScreenMode()
    } else {
      const { bottom, right } = await thisWindow.getBounds()

      if (bottom === undefined || right === undefined) {
        await setLeftTopForFullScreenMode()
      } else {
        left = right - width - rightOffset
        top = bottom - height - bottomOffset
      }
    }
  } finally {
    popupWindow.showAt(left, top)
    popupWindow.focus()
  }
}

/**
 * An OpenFin Popup hides itself when blurred
 */
export async function createOpenFinPopup(
  { height, name, width }: BasicWindow,
  pathname: string,
  callback: () => void,
): Promise<void> {
  try {
    const popupWindow = await fin.Platform.getCurrentSync().createWindow({
      name: popupNameFor(name),
      url: `${window.location.origin}${pathname}`,
      defaultHeight: height,
      defaultWidth: width,
      autoShow: false,
      frame: false,
      saveWindowState: false,
      cornerRounding: {
        height: 10,
        width: 10,
      },
    })
    await popupWindow.addListener("blurred", () =>
      popupWindow.hide().then(callback),
    )
  } catch (e: any) {
    if (e.message && e.message.includes("with name already in use")) {
      console.log(`Attempted to recreate hidden window: ${popupNameFor(name)}`)
    } else {
      console.error(e)
    }
  }
}

function isInternalGeneratedWindow(windowIdentity: Identity): boolean {
  // the "internal-generated-window" string is set by OpenFin
  return Boolean(
    windowIdentity.name &&
      windowIdentity.name.startsWith("internal-generated-window"),
  )
}

function isUserGeneratedPopup(windowIdentity: Identity): boolean {
  return Boolean(
    windowIdentity.name && windowIdentity.name.startsWith(openFinPopupPrefix),
  )
}

export function inMainOpenFinWindow() {
  const currentWindowName = fin.Window.getCurrentSync().identity.name

  // set in app.json
  return currentWindowName === mainOpenFinWindowName
}

/**
 * Windows created under the Platform controls are sibling windows - they persist
 * even after the main window is closed. The app creates two types of windows:
 * - Popups: manually created windows that serves as floating pieces of UI
 * - Internal Generated: Platform created windows (contain the blotter, tiles,
 *   and analytics Views when popped out). We use Platform windows to leverage
 *   the smart popout & drag in functionality.
 *
 * The below closes all of these windows when the main app window is closed. Not
 * closing the popups results in the application staying open with hidden popups.
 * Not closing the internal generated results in the popped out pieces of the
 * application persisting even after the main window is closed.
 */

export async function closeOtherWindows() {
  const app = fin.Application.getCurrentSync()
  const childWindows = await app.getChildWindows()

  for (let i = 0; i < childWindows.length; i++) {
    const winIdentity = childWindows[i].identity
    if (
      isInternalGeneratedWindow(winIdentity) ||
      isUserGeneratedPopup(winIdentity)
    ) {
      const wrapped = fin.Window.wrapSync({
        uuid: winIdentity.uuid,
        name: winIdentity.name,
      })
      await wrapped.close()
    }
  }
}

function generateRandomName() {
  let text = ""
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

function getChildWindows() {
  return new Promise<fin.OpenFinWindow[]>((resolve, reject) => {
    fin.desktop.Application.getCurrent().getChildWindows(
      (children: fin.OpenFinWindow[]) => resolve(children),
      (error: string) => reject(error),
    )
  })
}

export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
  displayName?: string
  minHeight?: number
  minWidth?: number
  maxHeight?: number
  maxWidth?: number
  center?: "parent" | "screen"
  x?: number
  y?: number
  saveWindowState?: boolean
  includeInSnapshots?: boolean
}

export async function openWindow(
  config: WindowConfig,
  onClose?: () => void,
): Promise<fin._Window> {
  const {
    url,
    width: defaultWidth,
    height: defaultHeight,
    displayName,
    maxHeight,
    maxWidth,
    minHeight = 100,
    minWidth = 100,
    x,
    y,
    includeInSnapshots,
  } = config

  const childWindows = await getChildWindows()
  const hasChildWindows = childWindows && childWindows.length
  const hasCoordinates = config.x !== undefined && config.y !== undefined
  const windowName = config.name || generateRandomName()
  const centered =
    (!hasChildWindows && !hasCoordinates) || config.center === "screen"

  const platform = await fin.Platform.getCurrent()
  const options = {
    autoShow: true,
    contextMenu: true,
    defaultCentered: centered,
    defaultHeight,
    defaultWidth,
    frame: false,
    icon: "/static/media/reactive-trader.ico",
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    defaultLeft: x,
    defaultTop: y,
    name: windowName,
    saveWindowState: false,
    includeInSnapshots,
    shadow: true,
    layout: {
      settings: {
        hasHeaders: false,
        reorderEnabled: false,
      },
      content: [
        {
          type: "stack",
          title: displayName || windowName,
          content: [
            {
              type: "component",
              title: displayName || windowName,
              componentName: "view",
              componentState: {
                name: `${windowName}_view`,
                url: `${window.location.origin}${url}`,
              },
            },
          ],
        },
      ],
    },
  }

  const windowIdentity = await platform.createWindow(options)
  const win = await fin.Window.wrap(windowIdentity)

  if (onClose) {
    const closeListener = () => {
      console.log(`Received 'close' event for OpenFin window: ${windowName}`)
      onClose && onClose()
    }

    win.once("closed", closeListener)
  }

  return win
}

export function closeWindow() {
  const win = fin.Window.getCurrentSync()
  win.close()
}
