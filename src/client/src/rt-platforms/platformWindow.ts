import { WindowConfig } from './types'

export type PlatformWindowApi = {
  open: (config: WindowConfig, onClose?: () => void) => Promise<PlatformWindow | undefined>
}

export type PlatformWindow = {
  readonly close: () => Promise<void>
  readonly getNativeWindow: () => Promise<Window>

  readonly maximize?: () => Promise<void>
  readonly minimize?: () => Promise<void>
  readonly resize?: () => Promise<void>
  readonly restore?: () => Promise<void>
  readonly bringToFront?: () => Promise<void>
}
