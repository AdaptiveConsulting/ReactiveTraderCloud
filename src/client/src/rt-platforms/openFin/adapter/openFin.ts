/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

import { Platform } from '../../platform'
import { AppConfig, InteropTopics } from '../../types'
import { createPlatformWindow, openDesktopWindow } from './window'
import { fromEventPattern } from 'rxjs'
import {
  Notification,
  NotificationActionEvent,
  removeEventListener,
  addEventListener,
  create,
} from 'openfin-notifications'
import { NotificationMessage } from '../../browser/utils/sendNotification'
import OpenFinRoute from './OpenFinRoute'
import { platformEpics } from './epics'
import Logo from './logo'
import { OpenFinControls, OpenFinHeader } from '../components'
import { ApplicationEpic } from 'StoreTypes'

export default class OpenFin implements Platform {
  readonly name = 'openfin'
  readonly type = 'desktop'
  readonly allowTearOff = true

  style = {
    height: '100%',
  }

  constructor() {
    window.addEventListener('beforeunload', this.handleWindowUnload)

    addEventListener('notification-action', this.handleNotificationAction)
  }

  window = {
    ...createPlatformWindow(() => Promise.resolve(fin.desktop.Window.getCurrent())),
    open: openDesktopWindow,
  }

  app = {
    exit: () => fin.desktop.Application.getCurrent().close(),
    open: (id: string, config: AppConfig) =>
      new Promise<string>((resolve, reject) => {
        fin.desktop.System.getAllApplications(apps => {
          const isRunning = apps.find(app => app.isRunning && app.uuid === id)
          if (isRunning) {
            // tslint:disable-next-line:no-unused-expression
            if (typeof config.topic === 'undefined') {
              console.error(`Error sending the message - topic was not defined`)
              return
            }

            config.payload && this.interop.publish(config.topic, config.payload)
            return
          }

          if (typeof config.uuid === 'undefined') {
            console.error(`Error creating the application - uuid was not defined in the config`)
            return
          }
          const app: fin.OpenFinApplication = new fin.desktop.Application(
            {
              name: config.uuid,
              uuid: config.uuid,
              url: config.url,
              mainWindowOptions: { icon: config.icon, autoShow: true, frame: true },
            },
            () =>
              app.run(
                () => setTimeout(() => resolve(id), 1000),
                err => reject(err),
              ),
            err => reject(err),
          )
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

  notification = {
    notify: (message: object) => {
      create({
        body: this.getNotificationBody(message as NotificationMessage),
        title: this.getNotificationTitle(message as NotificationMessage),
        icon: `${location.protocol}//${location.host}/static/media/icon.ico`,
        customData: message,
        buttons: [
          {
            title: 'Highlight trade in blotter',
            iconUrl: `${location.protocol}//${location.host}/static/media/icon.ico`,
            onClick: { task: 'highlight-trade' },
          },
        ],
        category: 'Trade Executed',
      })
        .then((successVal: Notification) => {
          console.info('Notification success', successVal)
        })
        .catch((err: any) => {
          console.error('Notification error', err)
        })
    },
  }

  Logo: React.FC = Logo

  PlatformHeader: React.FC<any> = OpenFinHeader

  PlatformControls: React.FC<any> = OpenFinControls

  PlatformRoute: React.FC<any> = OpenFinRoute

  getNotificationTitle({ tradeNotification }: NotificationMessage) {
    const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
    return `Trade ${status}: ${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional}`
  }

  getNotificationBody({ tradeNotification }: NotificationMessage) {
    return `vs. ${tradeNotification.termsCurrency} - Rate ${tradeNotification.spotRate} - Trade ID ${tradeNotification.tradeId}`
  }

  handleNotificationAction = (event: NotificationActionEvent) => {
    if (event.result['task'] === 'highlight-trade') {
      fin.InterApplicationBus.publish(InteropTopics.HighlightBlotter, event.notification.customData)
    }
  }

  handleWindowUnload = () => {
    removeEventListener('notification-action', this.handleNotificationAction)
  }

  epics: Array<ApplicationEpic> = platformEpics
}
