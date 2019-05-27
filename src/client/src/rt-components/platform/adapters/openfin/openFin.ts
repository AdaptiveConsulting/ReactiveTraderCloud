import { BasePlatformAdapter } from '../platformAdapter'
import { AppConfig, WindowConfig, InteropTopics, ExcelInterop } from '../types'
import { openDesktopWindow } from './window'
import { fromEventPattern } from 'rxjs'
import { excelAdapter } from './excel'
import { CurrencyPairPositionWithPrice } from 'rt-types'
import {
  Notification,
  NotificationButtonClickedEvent,
  NotificationOptions,
} from 'openfin-notifications'
import { NotificationMessage } from '../browser/utils/sendNotification'

export const openFinNotifications: any[] = []

type OpenFinWindowState = Parameters<Parameters<fin.OpenFinWindow['getState']>[0]>[0]
export default class OpenFin extends BasePlatformAdapter {
  readonly name = 'openfin'
  readonly type = 'desktop'

  private createNotification: (options: NotificationOptions) => Promise<Notification>

  constructor() {
    super()
    this.createNotification = require('openfin-notifications').create

    require('openfin-notifications').addEventListener(
      'notification-button-clicked',
      (event: NotificationButtonClickedEvent) => {
        fin.desktop.InterApplicationBus.publish(
          InteropTopics.HighlightBlotter,
          event.notification.customData,
        )
      },
    )
  }

  notificationHighlight = {
    init: () => this.interop.subscribe$(InteropTopics.HighlightBlotter),
  }

  chartIQ = {
    open: (id: string, config: AppConfig) => this.app.open(id, config),
  }

  window = {
    close: () => fin.desktop.Window.getCurrent().close(),

    open: (config: WindowConfig, onClose?: () => void) => openDesktopWindow(config, onClose),

    maximize: () => {
      const win = fin.desktop.Window.getCurrent()
      win.getState((state: OpenFinWindowState) => {
        switch (state) {
          case 'maximized':
          case 'minimized':
            win.restore(() => win.bringToFront())
            break
          case 'normal':
          default:
            win.maximize()
            break
        }
      })
    },

    minimize: () => fin.desktop.Window.getCurrent().minimize(),
  }

  app = {
    exit: () => fin.desktop.Application.getCurrent().close(),
    open: (id: string, config: AppConfig) =>
      new Promise<string>((resolve, reject) => {
        fin.desktop.System.getAllApplications(apps => {
          const isRunning = apps.find(app => app.isRunning && app.uuid === id)
          if (isRunning) {
            // tslint:disable-next-line:no-unused-expression
            config.payload && this.interop.publish(config.topic, config.payload)
          } else {
            const appConfig = {
              name: config.uuid,
              uuid: config.uuid,
              url: config.url,
              mainWindowOptions: {
                icon: config.icon,
                autoShow: true,
                frame: true,
              },
            }
            const app: fin.OpenFinApplication = new fin.desktop.Application(
              appConfig,
              () => app.run(() => setTimeout(() => resolve(id), 1000), err => reject(err)),
              err => reject(err),
            )
          }
        })
      }),
  }

  interop = {
    subscribe$: (topic: string) =>
      fromEventPattern(
        (handler: Function) =>
          fin.desktop.InterApplicationBus.subscribe('*', topic, handler as () => void),
        (handler: Function) =>
          fin.desktop.InterApplicationBus.unsubscribe('*', topic, handler as () => void),
      ),

    publish: (topic: string, message: string | object) =>
      fin.desktop.InterApplicationBus.publish(topic, message),
  }

  excel: ExcelInterop = {
    adapterName: excelAdapter.name,
    open: () => excelAdapter.openExcel(),
    isOpen: () => excelAdapter.isSpreadsheetOpen(),
    publishPositions: (positions: CurrencyPairPositionWithPrice[]) =>
      excelAdapter.publishPositions(positions),
    publishBlotter: <T extends any>(blotterData: T) => excelAdapter.publishBlotter(blotterData),
  }

  notification = {
    notify: (message: object) => {
      console.error('notify - message', message)
      this.createNotification(
        Object.assign({
          body: this.getTradeNotificationBody(message),
          title: this.getTradeNotificationTitle(message),
          icon: `${location.protocol}//${location.host}/static/media/icon.ico`,
          customData: message,
          buttons: [{ title: 'Highlight trade in blotter' }],
        }),
      )
        .then(successVal => {
          console.info('Notification success!', successVal)
        })
        .catch(err => {
          console.error('Notification error', err)
        })
    },
  }

  getTradeNotificationTitle({ tradeNotification }: NotificationMessage) {
    const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
    return `Trade ${status}: ${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${
      tradeNotification.notional
    }`
  }

  getTradeNotificationBody({ tradeNotification }: NotificationMessage) {
    return `vs. ${tradeNotification.termsCurrency} - Rate ${
      tradeNotification.spotRate
    } - Trade ID ${tradeNotification.tradeId}`
  }
}
