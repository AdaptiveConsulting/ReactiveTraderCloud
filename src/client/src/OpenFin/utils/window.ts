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
  urlOrPath: string,
  callback: () => void,
): Promise<void> {
  try {
    const popupWindow = await fin.Platform.getCurrentSync().createWindow({
      name: popupNameFor(name),
      url: `${
        urlOrPath.includes("http") ? "" : window.location.origin
      }${urlOrPath}`,
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
