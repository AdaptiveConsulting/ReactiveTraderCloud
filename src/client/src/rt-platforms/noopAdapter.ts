import { Platform } from './platform'
import { WindowConfig } from './types'
import DefaultRoute from './defaultRoute'

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
  PlatformFooter = () => null
  style = {}

  window = {
    close: () => {
      throw new Error('NOT IMPLEMENTED')
    },
    open: (config: WindowConfig, onClose?: () => void) => {
      throw new Error('NOT IMPLEMENTED')
    },
  }

  fdc3 = {
    broadcast: throwNotImplemented,
  }

  notification = {
    notify: throwNotImplemented,
  }
}
