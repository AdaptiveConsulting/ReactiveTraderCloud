import { WindowConfig } from './types'

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
  }
  interop?: {
    subscribe?: (sender: string, topic: string, listener: () => void) => void
    unsubscribe?: (sender: string, topic: string, listener: () => void) => void
    publish?: (topic: string, message: string) => void
  }
}
