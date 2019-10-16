import { PlatformAdapter } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

export function showCurrencyPair(currencyPair: string, { window }: PlatformAdapter) {
  // TODO: position and size of the window, also make it frame-less
  window.open({
    ...defaultConfig,
    url: `${windowOrigin}/spot/${currencyPair.toUpperCase()}?tileView=Normal`,
  })
}
