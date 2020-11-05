import ReactGA from 'react-ga'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'
import { NotificationMessage, NotifyPermission, sendNotification } from './utils/sendNotification'
import { Platform } from '../platform'
import { createDefaultPlatformWindow } from '../defaultPlatformWindow'
import DefaultRoute from '../defaultRoute'
import Logo from '../logo'
import { isRunningInIE } from '../helpers'

export default class Browser implements Platform {
  readonly name = 'browser'
  readonly type = 'browser'
  readonly allowTearOff = !isRunningInIE()

  style = {
    height: '100%',
  }
  epics = []
  PlatformHeader = () => null
  PlatformFooter = () => null
  PlatformControls = () => null
  PlatformRoute = DefaultRoute
  Logo = Logo

  allowPopIn = true

  window = {
    ...createDefaultPlatformWindow(window),
    open: (config: WindowConfig, onClose?: () => void) => {
      ReactGA.event({
        category: 'RT - Window',
        action: 'open',
        label: config.name,
      })
      return openBrowserWindow(config, onClose)
    },
    show: () => {},
  }

  notification = {
    notify: (message: object) => {
      if ('Notification' in window) {
        if (Notification.permission === NotifyPermission.granted) {
          sendNotification(message as NotificationMessage)
        }
      }
    },
  }

  /*
    TODO: Browser can subscribe and publish via the web socket, so it would make sense to implement these methods.
    In that case the interop object could be promoted as abstract to the base class
  */
  // interop?: {
  //   subscribe$: (topic: string) => Observable<any>
  //   publish: (topic: string, message: any) => void
  // }
}
