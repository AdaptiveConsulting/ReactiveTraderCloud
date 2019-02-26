import { PlatformAdapter } from '../platformAdapter'
import { AppConfig, WindowConfig } from '../types'
import { openDesktopWindow } from './window'
import { fromEventPattern } from 'rxjs'
import { excelAdapter } from './excel'

export const openFinNotifications: any[] = []

declare const window: any

export const setupGlobalOpenfinNotifications = () => {
  if (typeof fin !== 'undefined' && !window.onNotificationMessage) {
    // openfin requires a global onNotificationMessage function to be defined before its notification structure is initialized in the platform adapter.
    // NotificationRoute is imported lazily, thus we cannot define the function in that file. (Testing has shown it's already too late.)
    // - D.S.
    window.onNotificationMessage = (message: any) => openFinNotifications.push(message)
  }
}

export default class OpenFin implements PlatformAdapter {
  name = 'openfin'
  type = 'desktop'
  interopServices = {
    excel: true,
    chartIQ: true,
    notificationHighlight: true,
  }

  window = {
    close: () => fin.desktop.Window.getCurrent().close(),

    open: (config: WindowConfig, onClose?: () => void) => openDesktopWindow(config, onClose),

    maximize: () => {
      const win = fin.desktop.Window.getCurrent()
      win.getState(state => {
        switch (state) {
          case 'maximized':
          case 'restored':
          case 'minimized':
            win.restore(() => win.bringToFront())
            break
          default:
            win.maximize()
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
        (handler: Function) => fin.desktop.InterApplicationBus.subscribe('*', topic, handler as () => void),
        (handler: Function) => fin.desktop.InterApplicationBus.unsubscribe('*', topic, handler as () => void),
      ),

    publish: (topic: string, message: string | object) => fin.desktop.InterApplicationBus.publish(topic, message),

    excel: {
      init: () => excelAdapter.actions.init(),
      open: () => excelAdapter.actions.openExcel(),
      publish: (topic: string, message: string | object) => excelAdapter.actions.publishToExcel(topic, message),
    },
  }

  notification = {
    notify: (message: object) =>
      new fin.desktop.Notification({
        url: '/notification',
        message,
        timeout: 8000,
      } as any),
  }
}
