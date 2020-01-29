import { Platform } from '../platform'
import { AppConfig, WindowConfig } from '../types'
import { fromEventPattern } from 'rxjs'
import DefaultRoute from '../defaultRoute'
import Logo from '../logo'
import { createDefaultPlatformWindow } from '../defaultPlatformWindow'

export class Finsemble implements Platform {
  readonly name = 'finsemble'
  readonly type = 'desktop'
  readonly allowTearOff = true
  style = {
    height: 'calc(100% - 25px)',
  }
  epics = []
  PlatformHeader = () => null
  PlatformControls = () => null
  PlatformFooter = () => null
  PlatformRoute = DefaultRoute
  Logo = Logo

  window = {
    ...createDefaultPlatformWindow(window),
    open: (config: WindowConfig, onClose?: () => void) => {
      const createdWindow = window.open()
      return Promise.resolve(createdWindow ? createDefaultPlatformWindow(createdWindow) : undefined)
    },
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
              const isRunning = config.uuid && config.uuid in activeWindows
              if (isRunning) {
                this.publish(config)
                return
              }
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
            },
          ),
      ),
  }

  private publish(config: AppConfig) {
    if (typeof config.topic === 'undefined') {
      console.error(`Can't publish on empty topic`)
      return
    }
    if (typeof config.payload === 'undefined') {
      console.error(`Can't publish empty payload`)
      return
    }
    this.interop.publish(config.topic, config.payload)
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

  notification = {
    notify: (message: object) =>
      window.FSBL &&
      window.FSBL.UserNotification.alert('trade', 'ALWAYS', 'trade-excecuted', message, {
        url: '/notification',
        duration: 1000 * 50,
      }),
  }
}
