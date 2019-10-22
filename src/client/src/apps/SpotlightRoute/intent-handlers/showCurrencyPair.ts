import { InteropTopics, PlatformAdapter } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

let currencyPairWindow: Window = null

export function showCurrencyPair(currencyPair: string, platform: PlatformAdapter) {
  currencyPair = currencyPair.toUpperCase()

  if (!currencyPairWindow || currencyPairWindow.closed) {
    // TODO: position and size of the window, also make it frame-less
    platform.window
      .open(
        {
          ...defaultConfig,
          url: `${windowOrigin}/spot/${currencyPair}?tileView=Normal`,
        },
        () => (currencyPairWindow = null),
      )
      .then(w => (currencyPairWindow = w))
  } else if (platform.hasFeature('interop')) {
    platform.interop.publish(InteropTopics.FilterCurrencyPair, currencyPair)
  }
}
