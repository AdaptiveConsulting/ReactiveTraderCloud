import { Observable } from 'rxjs'
import { CurrencyPairPosition } from 'rt-types'

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

export interface PlatformFeatures {
  excel: ExcelInterop
  chartIQ: ChartIQInterop
  notificationHighlight: NotificationHighlightInterop
  interop: PubSubInterop
}

interface PubSubInterop {
  subscribe$: (topic: string) => Observable<any>
  publish: (topic: string, message: any) => void
}

interface ExcelInterop {
  open(): void
  isOpen(): boolean
  publishPositions: (positions: CurrencyPairPosition[]) => void
  publishBlotter: <T extends any>(blotterData: T) => void
}

interface ChartIQInterop {
  open: (id: string, config: AppConfig) => Promise<string>
}

interface NotificationHighlightInterop {
  init: () => Observable<{}>
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
