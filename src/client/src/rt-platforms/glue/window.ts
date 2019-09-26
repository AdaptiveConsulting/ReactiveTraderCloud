import { WindowConfig } from '../types'
import { frameButtonBase64 } from './utils/frameButtonImage'
import { onGlueLoaded } from './glue'

type BrowserWindowProps = WindowConfig
type GDWindow = any
type GlueInterface = any
type RelativeDirection = any

let listOfOpenedWindows: GDWindow[] = []

// TODO are there better ways to check?
const isSpot = (url: string) => url.indexOf('spot') >= 0
const isAnalytics = (url: string) => url.indexOf('analytics') >= 0

/**
 * Glue42 has the ability to manage windows. The registered methods here give the ability to demonstrate different
 * functionalities with the opened windows (Activity, Blotter, Spot windows).
 */
export const registerWindowMethods = (glue: GlueInterface) => {
  if (isSpot(location.href)) {
    return
  }

  let isCollapsed = false
  glue.agm.register('toggleCollapse', async () => {
    for (const wnd of listOfOpenedWindows) {
      isCollapsed ? await wnd.expand() : await wnd.collapse()
    }
    isCollapsed = !isCollapsed
  })

  glue.agm.register('stackAllWindows', () => {
    listOfOpenedWindows.forEach(async (wnd, index) => {
      if (index > 0) {
        await wnd.detachTab({
          relativeTo: listOfOpenedWindows[index - 1],
          relativeDirection: 'bottom',
        })
      }
    })
  })

  glue.agm.register('tabAllWindows', () => {
    listOfOpenedWindows.forEach(async (wnd, index) => {
      if (index > 0) {
        await listOfOpenedWindows[0].attachTab(wnd, index)
      }
    })
  })

  // @ts-ignore temporarily
  glue.agm.register('openWorkspace', (args: { symbol: string }) => {
    // @ts-ignore temporarily
    window.glue42gd.canvas.openWorkspace('Reactive Trader Workspace', { context: args })
  })

  glue.windows.onWindowRemoved((removedWnd: GDWindow) => {
    listOfOpenedWindows = listOfOpenedWindows.filter(wnd => wnd.id !== removedWnd.id)
    onGlueLoaded(() => {
      glue.agm.invoke('toggleHeaderButtons', { numberOfOpenedWindows: listOfOpenedWindows.length })
    })
  })
}

export const openGlueWindow = async (config: BrowserWindowProps, onClose?: () => void) => {
  onGlueLoaded(async () => {
    const glue = window.glue
    const myWindow: GDWindow = glue.windows.my()
    const { name, width, height, url } = config
    const {
      left,
      top,
      modifiedWidth,
      modifiedHeight,
      relativeTo,
      relativeDirection,
    } = calculatePosition(myWindow, width, height, url)
    const fullUrl = `${location.href.slice(0, -1)}${url}`
    const isTabWindow = isSpot(url)

    const win = await glue.windows.open(name, fullUrl, {
      title: capitalizeFirstLetter(name.split(' ')[0]),
      width: Math.round(modifiedWidth),
      height: Math.round(modifiedHeight),
      left: Math.round(left),
      top: Math.round(top),
      relativeTo,
      relativeDirection,
      allowCollapse: false,
      mode: 'tab',
      tabGroupId: isTabWindow ? 'reactiveTraderCloudSpot' : name,
    } as any) // TODO remove as any when typings for glue.windows.open() are fixed

    if (isTabWindow) {
      listOfOpenedWindows.push(win)
      glue.agm.invoke('toggleHeaderButtons', { numberOfOpenedWindows: listOfOpenedWindows.length })
    }

    if (win) {
      if (onClose) {
        win.onClose(onClose)
      }
      if (isTabWindow) {
        await win.activate()
      }
      addFrameButton(win)
      return Promise.resolve(win)
    } else {
      return Promise.reject(null)
    }
  })
}

const calculatePosition = (
  myWindow: GDWindow,
  width: number,
  height: number,
  url: string,
): {
  left: number
  top: number
  modifiedWidth: number
  modifiedHeight: number
  relativeTo: string
  relativeDirection: RelativeDirection
} => {
  let left = 0
  let top = 0
  let relativeTo = ''
  let relativeDirection: RelativeDirection = 'left'

  if (isSpot(url)) {
    left = myWindow.bounds.left - width - 20
    top = myWindow.bounds.top
  } else {
    relativeTo = myWindow.id
    if (isAnalytics(url)) {
      relativeDirection = 'right'
    } else {
      height = 260
      width = 1400
      relativeDirection = 'bottom'
    }
  }
  return { left, top, modifiedWidth: width, modifiedHeight: height, relativeTo, relativeDirection }
}

const capitalizeFirstLetter = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

/**
 * Adds a custom frame button for expand/collapse.
 */
const addFrameButton = (win: GDWindow) => {
  win.addFrameButton(
    {
      buttonId: `${win.id}-collapse`,
      order: 2,
      tooltip: 'Collapse',
      imageBase64: frameButtonBase64,
    },
    () => {
      win.onFrameButtonClicked((buttonInfo: any, wnd: GDWindow) => {
        if (!wnd.isCollapsed) {
          wnd.collapse()
          return
        }
        wnd.group.windows.forEach((tileWindow: GDWindow) => {
          if (tileWindow.id === wnd.id) {
            wnd.expand()
          } else {
            tileWindow.collapse()
          }
        })
      })
    },
    console.error,
  )
}
