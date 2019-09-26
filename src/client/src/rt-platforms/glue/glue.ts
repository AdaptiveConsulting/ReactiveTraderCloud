import Glue, { Glue42 as GlueInterface } from '@glue42/desktop'
import Glue4Office, { Glue42Office as Glue42OfficeInterface } from '@glue42/office'
import { CurrencyPairPositionWithPrice } from 'rt-types'
import { WindowConfig } from '../types'
import { BasePlatformAdapter } from '../platformAdapter'
import { openGlueWindow, registerWindowMethods } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'
import { getAddinStatus, openSheet, updateSheet, BlotterData } from './utils/excel'
import DefaultRoute from 'rt-platforms/defaultRoute'
import Logo from 'apps/MainRoute/components/app-header/Logo'
import { ApplicationEpic } from 'StoreTypes'

// TODO remove onGlueLoaded and its usages when the whole app is rendered after glue has loaded
export const onGlueLoaded = (callback: () => void) => {
  const interval = setInterval(() => {
    if (window.glue) {
      callback()
      clearInterval(interval)
    }
  }, 100)
}

/**
 * Glue implementation of the base platform adapter.
 * Glue4Office is an optional library for working with excel.
 */
export default class Glue42 extends BasePlatformAdapter {
  allowTearOff: boolean
  readonly name = 'glue'
  readonly type = 'desktop'

  constructor() {
    super()
    Glue({ channels: true })
      .then((glue: GlueInterface.Glue) => {
        window.glue = glue
        registerWindowMethods(glue)
        return Glue4Office()
      })
      .then((glue4office: Glue42OfficeInterface.Glue4Office) => {
        window.glue4office = glue4office
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  // TODO how can we remove the any?
  window: any = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose?: () => void) => openGlueWindow(config, onClose),

    /**
     * In order to integrate Glue42 with channels the clicked symbol needs to be published to the channel.
     */
    publishToChannel: (symbol: string) => {
      onGlueLoaded(() => {
        try {
          window.glue.channels.publish({ symbol: symbol.replace('/', '') })
        } catch (err) {
          console.warn(err.message)
        }
      })
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

  fdc3 = {
    broadcast: () => {},
  }

  excel = {
    open: () => openSheet(),
    isOpen: () => getAddinStatus(),
    publishPositions: (positions: CurrencyPairPositionWithPrice[]) => positions,
    publishBlotter: (blotterData: BlotterData[]) => updateSheet(blotterData),
  }

  epics: Array<ApplicationEpic> = []

  PlatformHeader: React.FC<any> = () => null

  PlatformControls: React.FC<any> = () => null

  PlatformRoute: React.FC = DefaultRoute

  Logo: any = Logo
}
