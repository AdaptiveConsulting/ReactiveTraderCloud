import { Platform } from './platform'
import { WindowConfig } from './types'
import DefaultRoute from './defaultRoute'
import { Noop } from 'rt-intents'

function throwNotImplemented() {
  throw new Error('NOT IMPLEMENTED')
}

export default class NoopPlatformAdapter implements Platform {
  readonly name = 'noop'
  readonly type = 'browser'
  readonly allowTearOff = false
  epics = []
  Logo = () => null
  PlatformHeader = () => null
  PlatformControls = () => null
  PlatformRoute = DefaultRoute
  style = {}

  window = {
    close: () => {
      throw new Error('NOT IMPLEMENTED')
    },
    open: (config: WindowConfig, onClose?: () => void) => {
      throw new Error('NOT IMPLEMENTED')
    },
  }

  intents = new Noop()

  notification = {
    notify: throwNotImplemented,
  }
}
