import { API } from '../api'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'

export default class Browser implements API {
  type = 'browser'

  window = {
    close: () => window.close(),

    open: (config: WindowConfig) => openBrowserWindow(config),
  }
}
