import { WindowConfig } from "./openWindow"

// TODO - Move to generic place
function getChildWindows() {
  return new Promise<fin.OpenFinWindow[]>((resolve, reject) => {
    fin.desktop.Application.getCurrent().getChildWindows(
      (children: fin.OpenFinWindow[]) => resolve(children),
      (error: string) => reject(error),
    )
  })
}

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
