import Glue, { Glue42 as Glue42Interface } from 'tick42-glue'
import Glue4Office, { Glue42Office as Glue42OfficeInterfaceWrapper } from 'glue4office'
import { CurrencyPairPositionWithPrice } from '../../../../rt-types'
import { WindowConfig } from '../types'
import { BasePlatformAdapter } from '../platformAdapter'
import { openGlueWindow, registerWindowMethods } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'
import { getAddinStatus, openSheet, updateSheet, BlotterData } from './utils/excel'

type GlueInterface = Glue42Interface.Glue
type Glue42OfficeInterface = Glue42OfficeInterfaceWrapper.Glue4Office

declare global {
  interface Window {
    glue: GlueInterface
    glue4office: Glue42OfficeInterface
  }
}

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
Glue({ channels: true })
  .then((glue: GlueInterface) => {
    window.glue = glue
    registerWindowMethods(glue)
    return Glue4Office()
  })
  .then((glue4office: Glue42OfficeInterface) => {
    window.glue4office = glue4office
  })
  .catch(err => {
    console.error(err)
  })

export default class Glue42 extends BasePlatformAdapter {
  readonly name = 'glue'
  readonly type = 'desktop'

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
}
