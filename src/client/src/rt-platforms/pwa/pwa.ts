import ReactGA from 'react-ga'
import { Platform } from '../platform'
import DefaultRoute from '../defaultRoute'
import { isRunningInIE } from 'rt-platforms'
import Logo from '../logo'
import {
  NotificationMessage,
  NotifyPermission,
  sendNotification,
} from '../browser/utils/sendNotification'
import { createDefaultPlatformWindow } from '../defaultPlatformWindow'
import { WindowConfig } from '../types'
import { openBrowserWindow } from '../browser/window'

export default class PWA implements Platform {
  readonly name = 'pwa'
  readonly type = 'desktop'
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
}
