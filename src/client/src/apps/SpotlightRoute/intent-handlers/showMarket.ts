import { Platform, PlatformWindow } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

let openedWindow: PlatformWindow | undefined

export async function showMarket({ window }: Platform) {
  if (openedWindow) {
    openedWindow.restore && openedWindow.restore()
    openedWindow.bringToFront && openedWindow.bringToFront()
    return
  }
  // TODO: position and size of the window, also make it frame-less
  openedWindow = await window.open({
    ...defaultConfig,
    url: `${windowOrigin}/tiles`,
  })
  if (!openedWindow) {
    console.log(`Error opening new window`)
  }
}
