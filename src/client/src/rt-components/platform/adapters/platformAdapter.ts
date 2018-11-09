import { AppConfig, WindowConfig } from './types'

export interface PlatformAdapter {
  name: string
  type: string

  window: {
    open?: (config: WindowConfig) => Promise<Window | null>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
    addEventListener?: (type: string, handler: () => void) => void
  }

  app?: {
    exit?: () => void
    open?: (id: string, config: AppConfig) => Promise<string>
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
