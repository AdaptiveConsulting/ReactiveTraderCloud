import { BasePlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openGlueWindow, registerWindowMethods } from './window'
import { sendNotification, NotifyPermission } from './utils/sendNotification'
import { CurrencyPairPositionWithPrice } from '../../../../rt-types/index'
import { getAddinStatus, openSheet, updateSheet } from './utils/excel'
const Glue = require('tick42-glue').default
const Glue4Office = require('glue4office').default

/**
 * Glue implementation of the base platform adapter.
 * Glue4Office is optional library for working with excel.
 */
Glue({ channels: true })
  .then((glue: any) => {
    (window as any).glue = glue
    registerWindowMethods(glue)
  })
  .catch((err: any) => {
    console.error(err)
  })
Glue4Office()
  .then((glue4office: any) => {
    (window as any).glue4office = glue4office
  })
  .catch((err: any) => {
    console.error(err)
  })

export default class Glue42 extends BasePlatformAdapter {
  readonly name = 'glue'
  readonly type = 'desktop'

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose?: () => void) => openGlueWindow(config, onClose),
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

  fdc3: {
    broadcast: () => {}
  }

  excel = {
    open: () => openSheet(),
    isOpen: () => getAddinStatus(),
    publishPositions: (positions: CurrencyPairPositionWithPrice[]) => positions,
    publishBlotter: (blotterData: any[]) => updateSheet(blotterData),
  }
}
