import { PlatformWindow, Platform } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

let openedWindow: PlatformWindow | undefined
let updatedPosition: { x: number | undefined; y: number | undefined } = {
  x: undefined,
  y: undefined,
}

const updatePosition = ({ left, top }: { left: number; top: number }) => {
  updatedPosition.x = left
  updatedPosition.y = top
}

async function openNewWindow(
  platform: Platform,
  currencyPair: string,
): Promise<PlatformWindow | undefined> {
  return platform.window.open(
    {
      ...defaultConfig,
      width: 380,
      height: 200,
      name: currencyPair,
      url: `${windowOrigin}/spot/${currencyPair}?tileView=Analytics`,
      ...updatedPosition,
    },
    () => (openedWindow = undefined),
    updatePosition,
  )
}

export async function showCurrencyPair(currencyPair: string, platform: Platform) {
  currencyPair = currencyPair.toUpperCase()

  openedWindow = await openNewWindow(platform, currencyPair)
  if (!openedWindow) {
    console.log(`Error opening new window`)
  }
}
