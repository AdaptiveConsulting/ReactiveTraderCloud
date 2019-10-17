import { InteropTopics, PlatformAdapter } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

type BlotterFilters = {
  readonly currencyPair: string
  readonly currency: string
}

let blotterWindow: Window = null;

export function showBlotter(
  filters: BlotterFilters,
  platform: PlatformAdapter,
) {

  // TODO: position and size of the window, also make it frame-less
  // TODO: do filtering by currency pair, currency, amount of trades
  if (!blotterWindow || blotterWindow.closed) {
    platform.window.open({
      ...defaultConfig,
      url: `${windowOrigin}/blotter`,
    }, () => blotterWindow = null).then(w => blotterWindow = w);
  } else if (platform.hasFeature('interop')) {
    platform.interop.publish(InteropTopics.FilterBlotter, filters);
  }

}
