import { SpotTileData as SpotTileDataType } from './spotTileData'
import { ExecuteTradeRequest as ExecuteTradeRequestType } from './executeTradeRequest'
import {
  createTradeRequest,
  DEFAULT_NOTIONAL,
  TradeRequest as TradeRequestType,
} from './spotTileUtils'
import { SpotPriceTick as SpotPriceTickType } from './spotPriceTick'

export { createTradeRequest, DEFAULT_NOTIONAL }
export type SpotTileData = SpotTileDataType
export type ExecuteTradeRequest = ExecuteTradeRequestType
export type TradeRequest = TradeRequestType
export type SpotPriceTick = SpotPriceTickType
