import ReactGA from 'react-ga'
import GlueWeb from '@glue42/web'
import { WindowConfig } from '../types'
import { Platform } from '../platform'
import { registerWindowMethods } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'
import DefaultRoute from 'rt-platforms/defaultRoute'
import { ApplicationEpic } from 'StoreTypes'
import { GlueHeader, GlueLogoLink } from './'


export class Glue42Core implements Platform {
  allowTearOff = true
  allowPopIn = true
  readonly name = 'glue-core'
  readonly type = 'browser'
  style = {
    height: '100%',
  }

  constructor() {
    GlueWeb()
      .then(glue => {
        window.glue = glue;
        registerWindowMethods()
      })
      .catch(() => {
        throw new Error('Failed to init Glue42Web')
      })
  }

  window = {
    close: () => {
      ReactGA.event({
        category: 'RT - Window',
        action: 'close',
        label: window.name,
      })
      return Promise.resolve(window.close())
    },

    open: (config: WindowConfig, onClose?: () => void) => {
      ReactGA.event({
        category: 'RT - Window',
        action: 'open',
        label: config.name,
      })
      window.glue.windows.onWindowRemoved(() => {
        onClose && onClose()
      })
      console.log(config)
      return window.glue.windows.open(config.name, config.url, config).then((createdWindow: any) => {
        Promise.resolve(createdWindow)
      })
    },

    /**
     * In order to integrate Glue42 with channels the clicked symbol needs to be published to the channel.
     */
    publishToChannel: (symbol: string) => {
      try {
        window.glue.channels.publish({ symbol: symbol.replace('/', '') })
      } catch (err) {
        console.warn(err.message)
      }
    },
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

  epics: Array<ApplicationEpic> = []

  PlatformHeader: React.FC<any> = () => null

  PlatformControls: React.FC<any> = GlueHeader

  PlatformRoute: React.FC = DefaultRoute

  Logo = GlueLogoLink
}
