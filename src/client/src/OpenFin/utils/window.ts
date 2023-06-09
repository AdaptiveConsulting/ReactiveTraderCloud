interface BasicWindow {
  name: string
  width: number
  height: number
}

/**
 * In Reactive Launcher platform app, the _root platform window_ (OF Platform Provider) has identity
 *  {uuid: 'reactive-launcher-<env e.g. local>', name: 'reactive-launcher-<env e.g. local>'}
 * from launcher.json manifest
 * For other windows under launcher, getParentWindow() will return this window,
 *  and only this window will return true from .isMainWindow()
 */
export type Offset = [number, number]
export const RT_LAUNCHER_MAIN_WINDOW_NAME = "Reactive-Launcher" // set in the JSON manifest
export const RT_FX_MAIN_WINDOW_NAME = "Reactive-Trader-FX" // set in the JSON manifest
export const RT_CREDIT_MAIN_WINDOW_NAME = "Reactive-Trader-Credit" // set in the JSON manifest
export const RT_PLATFORM_UUID_PREFIX = "reactive-trader-" // prefix for main uuid in the RT manifests

export function getWindowName() {
  return fin.Window.getCurrentSync().identity.name // e.g. Reactive-Trader-FX or Reactive-Trader-Credit
}

function getPopupPrefix() {
  return `${getWindowName()}-popup-`
}

function popupNameFor(name: string): string {
  return `${getPopupPrefix()}${name}`
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
  } catch (e) {
    if (
      e instanceof Error &&
      e.message &&
      e.message.includes("with name already in use")
    ) {
      console.log(`Attempted to recreate hidden window: ${popupNameFor(name)}`)
    } else {
      console.error(e)
    }
  }
}

function isInternalGeneratedWindow(
  windowIdentity: OpenFin.Identity,
  windowContext: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): boolean {
  // the "internal-generated-window" string is set by OpenFin when using Platform layout popout button
  return Boolean(
    windowIdentity.name &&
      windowIdentity.name.startsWith("internal-generated-window") &&
      windowContext &&
      windowContext.owningWindowName === getWindowName(),
  )
}

function isReactiveTraderSubWindow(windowIdentity: OpenFin.Identity): boolean {
  return Boolean(
    windowIdentity.name &&
      windowIdentity.name.startsWith(`${getWindowName()}-`),
  )
}

export function inReactiveTraderMainWindow() {
  const currentWindowName = getWindowName()

  return (
    currentWindowName === RT_FX_MAIN_WINDOW_NAME ||
    currentWindowName === RT_CREDIT_MAIN_WINDOW_NAME
  )
}

export function isReactiveTraderPlatformPrimary() {
  const currentWindowId = fin.Window.getCurrentSync().identity.uuid

  return currentWindowId.startsWith(RT_PLATFORM_UUID_PREFIX)
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
    const customWindowContext =
      await fin.Platform.getCurrentSync().getWindowContext(winIdentity)
    if (
      isInternalGeneratedWindow(winIdentity, customWindowContext) ||
      isReactiveTraderSubWindow(winIdentity)
    ) {
      const wrapped = fin.Window.wrapSync({
        uuid: winIdentity.uuid,
        name: winIdentity.name,
      })
      await wrapped.close()
    }
  }
}
