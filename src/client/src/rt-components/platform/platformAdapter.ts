import { AppConfig, WindowConfig } from './types'

export interface PlatformAdapter {
  type: string

  window: {
    open?: (config: WindowConfig) => Promise<Window | null>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
  }

  app?: {
    exit?: () => void
    open?: (options: object, cb: () => void) => void
    find?: (id: string, config: AppConfig) => Promise<string>
  }

  interop?: {
    subscribe: (sender: string, topic: string, listener: () => void) => void
    unsubscribe: (sender: string, topic: string, listener: () => void) => void
    publish: (topic: string, message: any) => void
  }

  notification?: {
    notify: (message: object) => void
  }
}
