import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'

declare global {
  interface Window {
    FSBL: any
  }
}

export default class Browser implements PlatformAdapter {
  name = 'finsemble'
  type = 'desktop'

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose: () => void) => Promise.resolve(window.open()),
  }
}
