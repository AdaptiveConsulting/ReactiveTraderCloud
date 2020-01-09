import { InteropTopics, PlatformWindow, Platform, platformHasFeature } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

let openedWindow: PlatformWindow | undefined

function updateOpenedWindow(
  currencyWindow: PlatformWindow,
  platform: Platform,
  currencyPair: string,
) {
  if (platformHasFeature(platform, 'interop')) {
    platform.interop.publish(InteropTopics.FilterCurrencyPair, currencyPair)
  } else {
    console.warn(`Error updating current currency pair window - interop is not available`)
    return
  }

  currencyWindow.restore && currencyWindow.restore()
  currencyWindow.bringToFront && currencyWindow.bringToFront()
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
      url: `${windowOrigin}/spot/${currencyPair}?tileView=Analytics`,
    },
    () => (openedWindow = undefined),
  )
}

export async function showCurrencyPair(currencyPair: string, platform: Platform) {
  currencyPair = currencyPair.toUpperCase()

  if (openedWindow) {
    updateOpenedWindow(openedWindow, platform, currencyPair)
    return
  }

  openedWindow = await openNewWindow(platform, currencyPair)
  if (!openedWindow) {
    console.log(`Error opening new window`)
  }
}
