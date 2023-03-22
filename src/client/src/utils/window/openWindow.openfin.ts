import { _Window } from "openfin-adapter/src/api/window"

import { WindowConfig } from "./openWindow"

// TODO - Maybe move to generic place
function generateRandomName() {
  let text = ""
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

// OpenFin windows open with shorter height than Chrome windows when
// set to open with the same height parameters. This offset compensates
// for the difference in height of OpenFin vs Chrome windows.
const OPENFIN_HEIGHT_OFFSET = 30

export async function openWindow(
  config: WindowConfig,
  onClose?: () => void,
): Promise<_Window> {
  const {
    url,
    width: defaultWidth,
    height,
    displayName,
    maxHeight,
    maxWidth,
    minHeight = 100,
    minWidth = 100,
    x,
    y,
    includeInSnapshots,
  } = config

  const childWindows = await fin.Application.getCurrentSync().getChildWindows()
  const hasChildWindows = childWindows && childWindows.length
  const hasCoordinates = config.x !== undefined && config.y !== undefined
  const windowName = config.name || generateRandomName()
  const centered =
    (!hasChildWindows && !hasCoordinates) || config.center === "screen"

  const platform = await fin.Platform.getCurrent()
  const options: OpenFin.PlatformWindowCreationOptions = {
    autoShow: true,
    contextMenu: true,
    defaultCentered: centered,
    defaultHeight: height + OPENFIN_HEIGHT_OFFSET,
    defaultWidth,
    frame: false,
    icon: "/static/media/reactive-trader.ico",
    maxHeight: maxHeight ? maxHeight + OPENFIN_HEIGHT_OFFSET : undefined,
    maxWidth,
    minHeight: minHeight + OPENFIN_HEIGHT_OFFSET,
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
          content: [
            {
              type: "component",
              title: displayName || windowName,
              componentName: "view",
              componentState: {
                name: `${windowName}_view`,
                url: `${
                  url.includes("http") ? "" : window.location.origin
                }${url}`,
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
