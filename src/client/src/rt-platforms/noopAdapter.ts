import { BasePlatformAdapter } from './platformAdapter'
import { WindowConfig } from './types'

function throwNotImplemented() {
  throw new Error('NOT IMPLEMENTED')
}

export default class NoopPlatformAdapter extends BasePlatformAdapter {
  readonly name = 'noop'
  readonly type = 'browser'
  readonly allowTearOff = false

  window = {
    close: throwNotImplemented,
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
