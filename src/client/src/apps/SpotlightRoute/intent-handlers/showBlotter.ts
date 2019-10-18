import { InteropTopics, PlatformAdapter } from 'rt-platforms'
import { stringify } from 'query-string'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'
import { BlotterFilters } from '../../MainRoute/widgets/blotter';

let blotterWindow: Window = null;

/**
 * Remove meaningless filter values
 */
function validateFilters(filters: BlotterFilters): BlotterFilters {
  return Object.entries(filters).reduce(
    (acc, [fieldId, values]) => {
      const validatedValues = values.filter(value => typeof value !== 'undefined' && value !== '')
      if (validatedValues.length > 0) {
        acc[fieldId] = validatedValues
      }
      return acc
    },
    {}
  )
}

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
