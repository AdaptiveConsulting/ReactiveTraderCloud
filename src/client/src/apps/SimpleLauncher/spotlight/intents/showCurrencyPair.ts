import { PlatformWindow, Platform } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

let openedWindow: PlatformWindow | undefined

async function openNewWindow(
  platform: Platform,
  currencyPair: string,
): Promise<PlatformWindow | undefined> {
  return platform.window.open(
    {
      ...defaultConfig,
      width: 380,
      height: 200,
      url: `${windowOrigin}/spot/${currencyPair}?tileView=Analytics`,
    },
    () => (openedWindow = undefined),
  )
}

export async function showCurrencyPair(currencyPair: string, platform: Platform) {
  currencyPair = currencyPair.toUpperCase()

  openedWindow = await openNewWindow(platform, currencyPair)
  if (!openedWindow) {
    console.log(`Error opening new window`)
  }
}
