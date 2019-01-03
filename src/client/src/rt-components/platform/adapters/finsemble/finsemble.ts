import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'

declare global {
  interface Window {
    FSBL: any
  }
}

export default class Finsemble implements PlatformAdapter {
  name = 'finsemble'
  type = 'desktop'

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose: () => void) => Promise.resolve(window.open()),
  }

  app = {
    open: (id: string, config: any) =>
      new Promise<string>((resolve, reject) => {
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
      }),
  }

  notification = {
    notify: (message: object) => {
      window.FSBL.UserNotification.alert('trade', 'ALWAYS', 'trade-excecuted', message, {
        url: '/notification',
        duration: 1000 * 3,
      })
    },
  }
}
