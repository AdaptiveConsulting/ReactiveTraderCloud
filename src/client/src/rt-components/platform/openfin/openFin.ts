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
  }

  interop = {
    subscribe: (sender: string, topic: string, listener: () => void) =>
      fin.desktop.InterApplicationBus.subscribe(sender, topic, listener),

    unsubscribe: (sender: string, topic: string, listener: () => void) =>
      fin.desktop.InterApplicationBus.unsubscribe(sender, topic, listener),

    publish: (topic: string, message: string) =>
      setInterval(() => fin.desktop.InterApplicationBus.publish(topic, message), 5000),
  }
}
