import { AppConfig, WindowConfig, InteropServices, PlatformName, PlatformType } from './types'
import { Observable } from 'rxjs'

interface PlatformAdapterInterface {
  readonly name: PlatformName
  readonly type: PlatformType
  interopServices: InteropServices

  window: {
    open: (config: WindowConfig, onClose?: () => void) => Promise<Window | null>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
  }

  app?: {
    exit?: () => void
    open?: (id: string, config: AppConfig) => Promise<string>
  }

  interop?: {
    subscribe$: (topic: string) => Observable<any>
    publish: (topic: string, message: any) => void
  }

  notification?: {
    notify: (message: object) => void
  }
}

export abstract class BasePlatformAdapter implements PlatformAdapterInterface {
  abstract readonly name: PlatformName
  abstract readonly type: PlatformType
  interopServices: InteropServices
  window: {
    open: (config: WindowConfig, onClose?: () => void) => Promise<Window>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
  }
  app?: { exit?: () => void; open?: (id: string, config: AppConfig) => Promise<string> }
  interop?: {
    subscribe$: (topic: string) => Observable<any>
    publish: (topic: string, message: any) => void
  }
  notification?: { notify: (message: object) => void }
}
