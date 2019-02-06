import { AppConfig, WindowConfig, InteropServices } from './types'

export interface PlatformAdapter {
  name: string
  type: string
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
    subscribe: (sender: string, topic: string, listener: () => void) => void
    unsubscribe?: (sender: string, topic: string, listener: () => void) => void
    publish: (topic: string, message: any) => void
  }

  notification?: {
    notify: (message: object) => void
  }
}
