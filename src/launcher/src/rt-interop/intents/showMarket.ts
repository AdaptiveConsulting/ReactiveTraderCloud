import { Platform, PlatformWindow } from 'rt-platforms'
import { defaultConfig } from './defaultWindowConfig'

let openedWindow: PlatformWindow | undefined
let updatedPosition: { x: number | undefined; y: number | undefined } = {
  x: undefined,
  y: undefined
}

const updatePosition = ({ left, top }: { left: number; top: number }) => {
  updatedPosition.x = left
  updatedPosition.y = top
}

export async function showMarket({ window }: Platform) {
  if (openedWindow) {
    openedWindow.restore && openedWindow.restore()
    openedWindow.bringToFront && openedWindow.bringToFront()
    return
  }

  // TODO: position and size of the window, also make it frame-less
  openedWindow = await window.open(
    {
      ...defaultConfig,
      name: 'market',
      height: 600,
      url: `/tiles`,
      saveWindowState: true,
      ...updatedPosition
    },
    () => (openedWindow = undefined),
    updatePosition
  )
  if (!openedWindow) {
    console.log(`Error opening new window`)
  }
}
