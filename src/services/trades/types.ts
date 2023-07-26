import { Direction, QuoteState } from "generated/TradingGateway"

import { CamelCase, CollectionUpdates } from "../utils"

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
    >,
    Trade {
  symbol: string
  valueDate: Date
  tradeDate: Date
}

export interface CreditTrade extends Trade {
  status: QuoteState
  tradeDate: Date
  direction: Direction
  counterParty: string
  cusip: string
  security: string
  quantity: number
  orderType: string
  unitPrice: number
}
export enum LimitCheckStatus {
  Success = "Success",
  Failure = "Failure",
}

export interface LimitCheckTrade extends Trade {
  status: LimitCheckStatus
  symbol: string
  notional: string
  spotRate: string
}

export interface Trade {
  tradeId: number
  [prop: string]: unknown
}

export type TradeType = FxTrade | CreditTrade | LimitCheckTrade
