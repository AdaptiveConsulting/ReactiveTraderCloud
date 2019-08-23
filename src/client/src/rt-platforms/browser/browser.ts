import { BasePlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'
import { UAParser } from 'ua-parser-js'

interface Navigator {
  standalone?: boolean
}

const isRunningInIE = () => {
  const browser = new UAParser().getBrowser().name
  return browser.indexOf('IE') !== -1
}

const isPWA = () =>
  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  (window.navigator as Navigator).standalone

export default class Browser extends BasePlatformAdapter {
  readonly name = 'browser'
  readonly type = 'browser'

  readonly allowTearOff = !isRunningInIE() && !isPWA()
  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose?: () => void) => openBrowserWindow(config, onClose),
  }

  fdc3 = {
    broadcast: () => {},
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

  /* 
    TODO: Browser can subscribe and publish via autobahn, so it would make sense to implement these methods.
    In that case the interop object could be promoted as abstract to the base class
  */
  // interop?: {
  //   subscribe$: (topic: string) => Observable<any>
  //   publish: (topic: string, message: any) => void
  // }
}
