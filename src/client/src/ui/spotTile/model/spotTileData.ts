import { ExecuteTradeRequest, Trade } from 'rt-types'
import { SpotPriceTick } from './spotPriceTick'

export interface LastTradeExecutionStatus {
  request: ExecuteTradeRequest
  hasError: boolean
  error?: string
  trade?: Trade
}

export interface SpotTileData {
  currencyChartIsOpening: boolean
  isTradeExecutionInFlight: boolean
  price?: SpotPriceTick
  lastTradeExecutionStatus?: LastTradeExecutionStatus | null
}
