import ReactGA from 'react-ga'
import Glue, { Glue42 as GlueInterface } from '@glue42/desktop'
import Glue4Office, { Glue42Office as Glue42OfficeInterface } from '@glue42/office'
import { WindowConfig } from '../types'
import { Platform } from '../platform'
import { openGlueWindow, registerWindowMethods } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'
import DefaultRoute from 'rt-platforms/defaultRoute'
import { ApplicationEpic } from 'StoreTypes'
import { GlueHeader, GlueLogoLink } from './'

/**
 * Glue implementation of the base platform adapter.
 * Glue4Office is an optional library for working with excel.
 */
export class Glue42 implements Platform {
  allowTearOff = true
  readonly name = 'glue'
  readonly type = 'desktop'
  style = {
    height: '100%',
  }

  constructor() {
    Glue({ channels: true })
      .then((glue: GlueInterface.Glue) => {
        window.glue = glue
        registerWindowMethods()
        return Glue4Office()
      })
      .then((glue4office: Glue42OfficeInterface.Glue4Office) => {
        window.glue4office = glue4office
      })
      .catch((err: any) => {
        console.error(err)
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
      return openGlueWindow(config, onClose)
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
