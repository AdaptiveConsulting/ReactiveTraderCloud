import * as currencyPair from './currencyPair'
import * as currencyPairPosition from './currencyPairPosition'
import * as serviceStatus from './serviceStatus'
import * as trade from './trade'
import * as user from './user'
import * as collectionUpdate from './CollectionUpdate'
import * as tradeMapper from './tradeMapper'

export type CurrencyPair = currencyPair.CurrencyPair
export type CurrencyPairMap = currencyPair.CurrencyPairMap

export type CurrencyPairPosition = currencyPairPosition.CurrencyPairPosition
export type CurrencyPairPositionWithPrice = currencyPairPosition.CurrencyPairPosition & {
  latestAsk?: number
  latestBid?: number
}
export { Direction } from './direction'

export const { ServiceConnectionStatus } = serviceStatus
export type ServiceConnectionStatus = serviceStatus.ServiceConnectionStatus
export type ServiceStatus = serviceStatus.ServiceStatus

export type Trade = trade.Trade
export type Trades = trade.Trades
export { TradeStatus } from './tradeStatus'
export { UpdateType } from './updateType'

export type User = user.User

export type CollectionUpdate = collectionUpdate.CollectionUpdate
export type CollectionUpdates = collectionUpdate.CollectionUpdates

export const { mapFromTradeDto } = tradeMapper
export type TradeRaw = tradeMapper.TradeRaw
export type RawTradeUpdate = tradeMapper.RawTradeUpdate
