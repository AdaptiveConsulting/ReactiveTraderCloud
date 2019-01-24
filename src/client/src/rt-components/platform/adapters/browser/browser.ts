import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'

export default class Browser implements PlatformAdapter {
  name = 'browser'
  type = 'browser'
  interopServices = {
    excel: false,
    chartIQ: false,
  }

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose: () => void) => openBrowserWindow(config, onClose),
  }

  notification = {
    notify: (message: object) => {
      if ('Notification' in window) {
        if (Notification.permission === NotifyPermission.granted) {
          sendNotification(message)
        }
      }
    },
  }
}
