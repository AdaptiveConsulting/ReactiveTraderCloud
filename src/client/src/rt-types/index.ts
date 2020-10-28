import type { CurrencyPairPosition } from './currencyPairPosition'
export type { CurrencyPair, CurrencyPairMap } from './currencyPair'

export type { CurrencyPairPosition }
export type CurrencyPairPositionWithPrice = CurrencyPairPosition & {
  latestAsk?: number
  latestBid?: number
}
export { Direction } from './direction'

export { ServiceConnectionStatus } from './serviceStatus'
export type { ServiceStatus } from './serviceStatus'

export type { Trade, Trades } from './trade'
export { TradeStatus } from './tradeStatus'
export { UpdateType } from './updateType'

export type { User } from './user'

export type { CollectionUpdate, CollectionUpdates } from './CollectionUpdate'

export { mapFromTradeDto } from './tradeMapper'
export type { TradeRaw, RawTradeUpdate } from './tradeMapper'
