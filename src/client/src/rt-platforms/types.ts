import { Observable } from 'rxjs'

export type PlatformName = 'browser' | 'openfin' | 'finsemble'
export type PlatformType = 'browser' | 'desktop'

export interface WindowPosition {
  visible: boolean
  x?: number
  y?: number
}

export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
  minHeight?: number
  minWidth?: number
  maxHeight?: number
  maxWidth?: number
  center?: 'parent' | 'screen'
  x?: number
  y?: number
}

export interface AppConfig {
  url?: string
  icon?: string
  uuid?: string
  payload?: string | object
  topic?: string
}

export interface PlatformFeatures {
  app: AppInterop
  interop: PubSubInterop
  share: (object: any) => {}
}

interface PubSubInterop {
  subscribe$: (topic: string) => Observable<any>
  publish: (topic: string, message: any) => void
}

interface AppInterop {
  open: (id: string, config: AppConfig) => Promise<string>
}

export enum InteropTopics {
  /* excel interop data feeds */
  Analytics = 'position-update',
  Blotter = 'blotter-data',

  /* onClick message bus for trade
  highlight on notification click  */
  HighlightBlotter = 'highlight-blotter',

  // Publish price changes on any ccy pair - legacy Excel uses this to update positions table
  PriceUpdate = 'price-update',

  // Close positions from Excel:
  // - legacy Excel adapter publishes these from the .NET code running in Excel
  // - Excel JS adapter publishes this from within this app when detects the command in Excel
  ClosePosition = 'close-position',

  // Send to legacy Excel adapter to update UI
  PositionClosed = 'position-closed',
}
