import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'
import { sendNotification, requestPermission } from './utils'

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
      Notification.permission === 'granted' ? sendNotification(tradeNotification) : requestPermission(tradeNotification)
    },
  }
}
