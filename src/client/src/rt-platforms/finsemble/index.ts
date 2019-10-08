import { BasePlatformAdapter } from '../platformAdapter'
import { WindowConfig, AppConfig } from '../types'
import { fromEventPattern } from 'rxjs'

export default class Finsemble extends BasePlatformAdapter {
  readonly name = 'finsemble'
  readonly type = 'desktop'
  readonly allowTearOff = true

  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose?: () => void) => Promise.resolve(window.open()),
  }

  fdc3 = {
    broadcast: () => {},
  }

  app = {
    open: (id: string, config: AppConfig) =>
      new Promise<string>(
        (resolve, reject) =>
          window.FSBL &&
          window.FSBL.Clients.LauncherClient.getActiveDescriptors(
            (error: string, activeWindows: object) => {
              const isRunning = config.uuid in activeWindows ? true : false
              if (isRunning) {
                this.interop.publish(config.topic, config.payload)
              } else {
                window.FSBL.Clients.LauncherClient.spawn(
                  config.uuid,
                  {
                    url: config.url,
                    name: config.uuid,
                    options: {
                      icon: config.icon,
                      autoShow: true,
                      frame: false,
                    },
                    addToWorkspace: true,
                  },
                  (err: string) => (err ? reject(err) : resolve()),
                )
              }
            },
          ),
      ),
  }

  interop = {
    subscribe$: (topic: string) =>
      fromEventPattern(
        (handler: Function) =>
          window.FSBL && window.FSBL.Clients.RouterClient.addListener(topic, handler),
      ),

    publish: (topic: string, message: string | object) =>
      window.FSBL && window.FSBL.Clients.RouterClient.transmit(topic, message),
  }

  style = {
    height: 'calc(100% - 25px)',
  }

  notification = {
    notify: (message: object) =>
      window.FSBL &&
      window.FSBL.UserNotification.alert('trade', 'ALWAYS', 'trade-excecuted', message, {
        url: '/notification',
        duration: 1000 * 50,
      }),
  }
}
