import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'

// types not currently available for FSBL - 1/24/2019
declare global {
  interface Window {
    FSBL: any
  }
}

export default class Finsemble implements PlatformAdapter {
  name = 'finsemble'
  type = 'desktop'
  interopServices = {
    excel: false,
    chartIQ: true,
    notificationHighlight: false,
  }

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose: () => void) => Promise.resolve(window.open()),
  }

  app = {
    open: (id: string, config: any) =>
      new Promise<string>((resolve, reject) => {
        window.FSBL.Clients.LauncherClient.getActiveDescriptors((error: any, activeWindows: any) => {
          const isRunning = config.uuid in activeWindows ? true : false
          if (isRunning) {
            this.interop.publish(config.topic, config.payload)
          } else {
            window.FSBL.Clients.LauncherClient.spawn(config.uuid, {
              url: config.url,
              name: config.uuid,
              options: {
                frame: true,
                icon: config.icon,
              },
              addToWorkspace: true,
            })
          }
        })
      }),
  }

  interop = {
    subscribe: (sender: string, topic: string, listener: () => void) =>
      window.FSBL.Clients.RouterClient.addListener(topic, listener),

    publish: (topic: string, message: string | object) => window.FSBL.Clients.RouterClient.transmit(topic, message),
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
