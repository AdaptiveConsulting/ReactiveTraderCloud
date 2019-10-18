import { InteropTopics, PlatformAdapter } from 'rt-platforms'
import { stringify } from 'query-string'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'
import { BlotterFilters, validateFilters } from '../../MainRoute/widgets/blotter';

let blotterWindow: Window = null;

export function showBlotter(
  filters: BlotterFilters,
  platform: PlatformAdapter,
) {
  // TODO: position and size of the window, also make it frame-less
  // TODO: do filtering by currency pair, currency, amount of trades
  if (!blotterWindow || blotterWindow.closed) {
    const baseUrl = `${windowOrigin}/blotter`
    const queryString = stringify(validateFilters(filters))
    const url = queryString ? `${baseUrl}/?${queryString}` : baseUrl

    platform.window.open({
      ...defaultConfig,
      url
    }, () => blotterWindow = null).then(w => blotterWindow = w);
  } else if (platform.hasFeature('interop')) {
    platform.interop.publish(InteropTopics.FilterBlotter, filters);
  }

}
