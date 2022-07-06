import { CamelCase, CollectionUpdates } from "../utils"

export enum Direction {
  Buy = "Buy",
  Sell = "Sell",
}

export enum TradeStatus {
  Pending = "Pending",
  Done = "Done",
  Rejected = "Rejected",
  Expired = "Expired",
}

export interface TradeRaw {
  TradeId: number
  CurrencyPair: string
  TraderName: string
  Notional: number
  DealtCurrency: string
  Direction: Direction
  Status: TradeStatus
  SpotRate: number
  TradeDate: string
  ValueDate: string
}

export interface RawTradeUpdate extends CollectionUpdates {
  Trades: TradeRaw[]
}

export interface FxTrade
  extends CamelCase<
    Omit<TradeRaw, "TradeId" | "ValueDate" | "TradeDate" | "CurrencyPair">
  > {
  tradeId: string
  symbol: string
  valueDate: Date
  tradeDate: Date
}

export interface CreditTrade {
  tradeId: string
  status: TradeStatus
  tradeDate: Date
  direction: Direction
  counterParty: string
  cusip: string
  security: string
  quantity: string
  orderType: string
  unitPrice: string
}

export type Trade = FxTrade | CreditTrade

export type AllTrades = FxTrade & CreditTrade
