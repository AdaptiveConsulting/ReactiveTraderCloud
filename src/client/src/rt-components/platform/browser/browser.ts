import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'

export default class Browser implements PlatformAdapter {
  type = 'browser'

  window = {
    close: () => window.close(),

    open: (config: WindowConfig) => openBrowserWindow(config),
  }
}
