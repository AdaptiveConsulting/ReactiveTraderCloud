import { InteropTopics, PlatformAdapter } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

let currencyPairWindow: Window | null = null

export function showCurrencyPair(currencyPair: string, platform: PlatformAdapter) {
  currencyPair = currencyPair.toUpperCase()

  if (!currencyPairWindow || currencyPairWindow.closed) {
    platform.window
      .open(
        {
          ...defaultConfig,
          width: 380,
          height: 180,
          url: `${windowOrigin}/spot/${currencyPair}?tileView=Normal`,
        },
        () => (currencyPairWindow = null),
      )
      .then(w => (currencyPairWindow = w))
  } else if (platform.hasFeature('interop')) {
    platform.interop.publish(InteropTopics.FilterCurrencyPair, currencyPair)
  }
}
