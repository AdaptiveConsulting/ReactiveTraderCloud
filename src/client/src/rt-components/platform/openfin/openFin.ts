import { PlatformAdapter } from '../platformAdapter'
import { AppConfig, WindowConfig } from '../types'
import { openDesktopWindow } from './window'

export default class OpenFin implements PlatformAdapter {
  type = 'openfin'

  window = {
    close: () => fin.desktop.Window.getCurrent().close(),

    open: (config: WindowConfig) => openDesktopWindow(config),

    maximize: () => fin.desktop.Window.getCurrent().maximize(),

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
                autoShow: false,
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
    subscribe: (sender: string, topic: string, listener: () => void) =>
      fin.desktop.InterApplicationBus.subscribe(sender, topic, listener),

    unsubscribe: (sender: string, topic: string, listener: () => void) =>
      fin.desktop.InterApplicationBus.unsubscribe(sender, topic, listener),

    publish: (topic: string, message: string | object) => fin.desktop.InterApplicationBus.publish(topic, message),
  }

  notification = {
    notify: (message: object) =>
      new fin.desktop.Notification({
        url: '/notification',
        message,
        duration: 20000,
      }),
  }
}
