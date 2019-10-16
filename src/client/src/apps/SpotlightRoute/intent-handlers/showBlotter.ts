import { PlatformAdapter } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

type ShowBlotterOptions = {
  readonly currencyPair: string
  readonly currency: string
}

export function showBlotter(
  { currencyPair, currency }: ShowBlotterOptions,
  { window }: PlatformAdapter,
) {
  // TODO: position and size of the window, also make it frame-less
  // TODO: do filtering by currency pair, currency, amount of trades
  window.open({
    ...defaultConfig,
    url: `${windowOrigin}/blotter`,
  })
}
