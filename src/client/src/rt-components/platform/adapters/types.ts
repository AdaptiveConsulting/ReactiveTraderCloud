export type PlatformName = 'browser' | 'openfin' | 'finsemble'
export type PlatformType = 'browser' | 'desktop'

export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
  center?: 'parent' | 'screen'
}

export interface AppConfig {
  url?: string
  icon?: string
  uuid?: string
  payload?: string | object
  topic?: string
}

export interface InteropServices {
  excel: boolean
  chartIQ: boolean
  notificationHighlight: boolean
}

export enum InteropTopics {
  /* excel interop data feeds */
  Analytics = 'position-update',
  Blotter = 'blotter-data',

  /* onClick message bus for trade
  highlight on notification click  */
  HighlightBlotter = 'highlight-blotter',

  /* closing trades from Excel, currently 
  not in use */
  ClosePosition = 'close-position',
}

export interface ExcelInterop {
  init(): void
  open(): void
  publish<T = string | object>(topic: string, message: T): void
}
