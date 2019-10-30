import { PlatformAdapter } from 'rt-platforms'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'

export function showMarket({ window }: PlatformAdapter) {
  // TODO: position and size of the window, also make it frame-less
  window.open({
    ...defaultConfig,
    url: `${windowOrigin}/tiles`,
  })
}
