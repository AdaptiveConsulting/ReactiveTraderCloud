import { Trade } from 'rt-types'
import { ExecuteTradeRequest } from './executeTradeRequest'
import { SpotPriceTick } from './spotPriceTick'
import { RfqState } from '../components/types'
import { TileState } from '../components/Tile/Tile'

export interface LastTradeExecutionStatus {
  request: ExecuteTradeRequest
  hasError: boolean
  error?: string
  trade?: Trade
}

export interface SpotTileData {
  currencyChartIsOpening: boolean
  isTradeExecutionInFlight: boolean
  price: SpotPriceTick
  historicPrices: SpotPriceTick[]
  lastTradeExecutionStatus?: LastTradeExecutionStatus | null
  rfqState: RfqState
  rfqReceivedTime: number | null
  rfqTimeout: number | null
  rfqPrice: SpotPriceTick | null
  requestedNotional: TileState | null
}
