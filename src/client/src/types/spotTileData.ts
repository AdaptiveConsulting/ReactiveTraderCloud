import { Notification } from './notification'

export interface SpotTileData {
  ask: number
  bid: number
  mid: number
  priceMovementType: string
  valueDate: string
  symbol: string
  notification: Notification
  currencyChartIsOpening: boolean
  isTradeExecutionInFlight: boolean
  priceStale: boolean
  hasError: boolean
}
