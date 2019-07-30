import { WindowConfig } from '../types'
import { Glue42 } from 'tick42-glue'

type BrowserWindowProps = WindowConfig
type GDWindow = Glue42.Windows.GDWindow

let listOfOpenedWindows: GDWindow[] = []

/**
 * Glue42 has the ability to manage windows.The registered methods here give the ability to demonstrate different
 * functionalities with the opened windows (Activity, Blotter, Spot windows)
 */
export const registerWindowMethods = (glue: any) => {
  if (location.href.indexOf('spot') >= 0) {
    return
  }

  let isCollapsed: boolean = false
  glue.agm.register('toggleCollapse', async () => {
    for (const wnd of listOfOpenedWindows) {
      isCollapsed ? await wnd.expand() : await wnd.collapse()
    }
    isCollapsed = !isCollapsed
  })

  glue.agm.register('stackAllWindows', () => {
    listOfOpenedWindows.forEach(async (wnd: GDWindow, i: number) => {
      if (i > 0) {
        await wnd.detachTab({ relativeTo: listOfOpenedWindows[i - 1], relativeDirection: 'bottom' })
      }
    })
  })

  glue.agm.register('tabAllWindows', () => {
    listOfOpenedWindows.forEach(async (wnd: GDWindow, i: number) => {
      if (i > 0) {
        await listOfOpenedWindows[0].attachTab(wnd, i)
      }
    })
  })

  glue.agm.register('openWorkspace', (args: { symbol: string }) => {
    (window as any).glue42gd.canvas.openWorkspace('Reactive Trader Workspace', { context: args })
  })

  glue.windows.onWindowRemoved((removedWnd: GDWindow) => {
    listOfOpenedWindows = listOfOpenedWindows.filter((wnd: GDWindow) => wnd.id !== removedWnd.id)
    if ((window as any).glue) {
      glue.agm.invoke('toggleHeaderButtons', { numberOfOpenedWindows: listOfOpenedWindows.length })
    }
  })
}

/**
 * Opens a new glue window
 * @param {BrowserWindowProps} config
 * @param {() => void} onClose
 * @return {Promise<any>}
 */
export const openGlueWindow = async (config: BrowserWindowProps, onClose?: () => void) => {
  if (!(window as any).glue) {
    return
  }
  const glue: any = (window as any).glue
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
  const isTabWindow: boolean = url.indexOf('spot') >= 0

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
  })

  if (url.indexOf('spot') >= 0) {
    listOfOpenedWindows.push(win)
    glue.agm.invoke('toggleHeaderButtons', { numberOfOpenedWindows: listOfOpenedWindows.length })
  }

  if (win) {
    if (onClose) {
      win.onClose(onClose)
    }
    if (isTabWindow) {
      win.activate()
    }
    addFrameButton(win)
    return Promise.resolve(win)
  } else {
    return Promise.reject(null)
  }
}

/**
 * Calculates the position to open a new window
 * @param {number} width
 * @param {number} height
 * @param {string} url
 * @return {{left: number; top: number; modifiedWidth: number; modifiedHeight: number; relativeTo: string; relativeDirection: string}}
 */
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
  relativeDirection: string
} => {
  let left: number = 0
  let top: number = 0
  let relativeTo: string = ''
  let relativeDirection: string = ''

  if (url.indexOf('spot') >= 0) {
    left = myWindow.bounds.left - width - 20
    top = myWindow.bounds.top
  } else {
    relativeTo = myWindow.id
    if (url.indexOf('analytics') >= 0) {
      relativeDirection = 'right'
    } else {
      height = 260
      width = 1400
      relativeDirection = 'bottom'
    }
  }
  return { left, top, modifiedWidth: width, modifiedHeight: height, relativeTo, relativeDirection }
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str
 * @return {string}
 */
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Adds a custom frame button for expand/collapse
 * @param {GDWindow} win
 */
const addFrameButton = (win: GDWindow) => {
  const frameButtonBase64: string =
    'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZFREI5MUI4QTg3RjExRTlCQzM4QTM4REZBN0I4QzlBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZFREI5MUI5QTg3RjExRTlCQzM4QTM4REZBN0I4QzlBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkVEQjkxQjZBODdGMTFFOUJDMzhBMzhERkE3QjhDOUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkVEQjkxQjdBODdGMTFFOUJDMzhBMzhERkE3QjhDOUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5BhFFBAAAAo0lEQVR42mL8//8/AzUBEwOVwRA0kJGREScGAm8g/gDE/5EwKgBFCjImBIBqfP6jAlT9pBgIlNcF4mdUMRAoJwnEr6GGPAJiFyD+RKkLO4D4CRCrQPm+FBkINUQEXxwwEdAsgSUVvCEp2YC8AaXVgdRlkDdJSojoToYGtA80rP5DaTFi9WMzEBnAI4BaBvqQ6kNCBn4AYm9SDGQcLQ8pBgABBgCNZoTrkbMx2wAAAABJRU5ErkJggg=='
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
