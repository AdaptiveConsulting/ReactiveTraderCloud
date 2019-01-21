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
  pubSubResponders: any = []

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

  interop = {
    publish: (topic: string, message: string | object) => {
      console.log(topic, message)
      if (this.pubSubResponders.includes(topic)) {
        window.FSBL.Clients.RouterClient.publish(topic, message)
      } else {
        window.FSBL.Clients.RouterClient.addPubSubResponder(topic, { State: 'start' }, (error: any) => {
          if (!error) {
            this.pubSubResponders.push(topic)
          }
        })
      }
    },
    subscribe: (sender: string, topic: string, listener: () => void) => {
      window.FSBL.Clients.RouterClient.subscribe(topic, listener)
    },
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
