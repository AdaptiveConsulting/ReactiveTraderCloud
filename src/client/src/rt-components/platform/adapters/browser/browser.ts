import { BasePlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'

export default class Browser extends BasePlatformAdapter {
  readonly name = 'browser'
  readonly type = 'browser'

  interopServices = {
    excel: false,
    chartIQ: false,
    notificationHighlight: false,
  }

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose?: () => void) => openBrowserWindow(config, onClose),
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
