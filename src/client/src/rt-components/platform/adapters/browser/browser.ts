import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'
import { sendNotification } from './utils'

export default class Browser implements PlatformAdapter {
  name = 'browser'
  type = 'browser'

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose: () => void) => openBrowserWindow(config, onClose),
  }

  notification = {
    notify: (message: any) => {
      const { tradeNotification } = message
      if (Notification.permission === 'granted') {
        sendNotification(tradeNotification)
      }
    },
  }
}
