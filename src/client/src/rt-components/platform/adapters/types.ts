import { Observable } from 'rxjs'
import { CurrencyPairPosition } from 'rt-types'
import { ExcelAdapterName } from './openfin/excel';

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

export interface ExcelInterop {
  readonly adapterName: ExcelAdapterName
  open(): Promise<void>
  isOpen(): boolean
  publishPositions: (positions: CurrencyPairPosition[]) => Promise<void>
  publishBlotter: <T extends any>(blotterData: T) => Promise<void>
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

  // Publish price changes on any ccy pair - legacy Excel uses this to update positions table
  PriceUpdate = 'price-update',

  // Close positions from Excel:
  // - legacy Excel adapter publishes these from the .NET code running in Excel
  // - Excel JS adapter publishes this from within this app when detects the command in Excel
  ClosePosition = 'close-position',

  // Send to legacy Excel adapter to update UI
  PositionClosed = 'position-closed',
}
