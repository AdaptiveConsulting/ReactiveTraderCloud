import { Direction, QuoteState } from "@/generated/TradingGateway"
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
  status: QuoteStateTypes
  tradeDate: Date
  direction: Direction
  counterParty: string
  cusip: string
  security: string
  quantity: number
  orderType: string
  unitPrice: number
}

export interface Trade {
  tradeId: string
  [prop: string]: unknown
}

export enum QuoteStateTypes {
  PENDING_WITHOUT_PRICE_QUOTE_STATE = "pendingWithoutPrice",
  PENDING_WITH_PRICE_QUOTE_STATE = "pendingWithPrice",
  PASSED_QUOTE_STATE = "passed",
  ACCEPTED_QUOTE_STATE = "accepted",
  REJECTED_WITH_PRICE_QUOTE_STATE = "rejectedWithPrice",
  REJECTED_WITHOUT_PRICE_QUOTE_STATE = "rejectedWithoutPrice",
}
