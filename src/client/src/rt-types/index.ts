import { CurrencyPair, CurrencyPairMap } from './currencyPair'
import { CurrencyPairPosition } from './currencyPairPosition'
import { ServiceStatus, ServiceConnectionStatus } from './serviceStatus'
import { SnapshotActiveStatus } from './snapshotStatus'
import { Trade, Trades } from './trade'
import { User } from './user'
import { CollectionUpdate, CollectionUpdates } from './CollectionUpdate'
import { mapFromTradeDto, TradeRaw, RawTradeUpdate } from './tradeMapper'

export type CurrencyPair = CurrencyPair
export type CurrencyPairMap = CurrencyPairMap

export type CurrencyPairPosition = CurrencyPairPosition
export type CurrencyPairPositionWithPrice = CurrencyPairPosition & {
  latestAsk?: number
  latestBid?: number
}
export { Direction } from './direction'

export { ServiceConnectionStatus }
export type ServiceStatus = ServiceStatus
export { SnapshotActiveStatus }

export type Trade = Trade
export type Trades = Trades
export { TradeStatus } from './tradeStatus'
export { UpdateType } from './updateType'

export type User = User

export type CollectionUpdate = CollectionUpdate
export type CollectionUpdates = CollectionUpdates

export { mapFromTradeDto }
export type TradeRaw = TradeRaw
export type RawTradeUpdate = RawTradeUpdate
