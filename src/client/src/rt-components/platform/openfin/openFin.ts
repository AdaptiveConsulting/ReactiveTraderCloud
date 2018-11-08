import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
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
    open: (options: object, cb: () => void) => new fin.desktop.Application(options, cb),
    find: (id: string) =>
      new Promise<boolean>(resolve => {
        fin.desktop.System.getAllApplications(apps => {
          const isRunning = apps.find(app => Boolean(app.isRunning) && app.uuid === id)
          resolve(Boolean(isRunning))
        })
      }),
  }

  interop = {
    subscribe: (sender: string, topic: string, listener: () => void) =>
      fin.desktop.InterApplicationBus.subscribe(sender, topic, listener),

    unsubscribe: (sender: string, topic: string, listener: () => void) =>
      fin.desktop.InterApplicationBus.unsubscribe(sender, topic, listener),

    publish: (topic: string, message: string) => fin.desktop.InterApplicationBus.publish(topic, message),
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
