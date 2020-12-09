import ReactGA from 'react-ga'
import { Platform } from '../platform'
import { AppConfig, WindowConfig } from '../types'
import { fromEventPattern } from 'rxjs'
import DefaultRoute from '../defaultRoute'
import Logo from '../logo'
import { createDefaultPlatformWindow } from '../defaultPlatformWindow'
import * as finsembleClient from './finsembleClient'

export class Finsemble implements Platform {
  readonly name = 'finsemble'
  readonly type = 'desktop'
  readonly allowTearOff = true
  style = {
    height: 'calc(100% - 25px)',
  }
  epics = []
  PlatformHeader = () => null
  PlatformFooter = () => null
  PlatformControls = () => null
  PlatformRoute = DefaultRoute
  Logo = Logo

  window = {
    ...createDefaultPlatformWindow(window),
    open: (config: WindowConfig, onClose?: () => void) => {
      ReactGA.event({
        category: 'RT - Window',
        action: 'open',
        label: config.name,
      })
      const createdWindow = window.open()
      return Promise.resolve(createdWindow ? createDefaultPlatformWindow(createdWindow) : undefined)
    },
    show: () => {},
  }

  app = {
    open: (id: string, config: AppConfig) =>
      new Promise<string>((resolve, reject) =>
        finsembleClient.getActiveDescriptors((error: string, activeWindows: object) => {
          const isRunning = config.uuid && config.uuid in activeWindows
          if (isRunning) {
            this.publish(config)
            return
          }
          finsembleClient.spawn(
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
            (err: string) => (err ? reject(err) : resolve())
          )
        })
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
      fromEventPattern((handler: Function) => finsembleClient.addListener(topic, handler)),

    subscribe: (topic: string, callback: Function) => finsembleClient.addListener(topic, callback),

    publish: (topic: string, message: string | object) => finsembleClient.transmit(topic, message),

    query: (topic: string, message: string | object, handler: Function) =>
      finsembleClient.query(topic, message, handler),
  }

  notification = {
    notify: (message: object) =>
      finsembleClient.alert(message),
  }
}
