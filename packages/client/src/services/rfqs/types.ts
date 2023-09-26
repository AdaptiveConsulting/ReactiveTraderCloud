import {
  ACCEPTED_QUOTE_STATE,
  AcceptedQuoteState,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  PendingWithPriceQuoteState,
  QuoteBody,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  REJECTED_WITHOUT_PRICE_QUOTE_STATE,
  RejectedWithPriceQuoteState,
} from "@/generated/TradingGateway"
import { CurrencyPair } from "@/services/currencyPairs"
import { Price } from "@/services/prices"

export interface RfqRequest {
  symbol: string
  notional: number
}

export interface RfqResponse {
  notional: number
  currencyPair: CurrencyPair
  price: Price
  time: number
  timeout: number
}

export type QuoteStatus =
  | typeof PENDING_WITHOUT_PRICE_QUOTE_STATE
  | typeof PENDING_WITH_PRICE_QUOTE_STATE
  | typeof PASSED_QUOTE_STATE
  | typeof ACCEPTED_QUOTE_STATE
  | typeof REJECTED_WITH_PRICE_QUOTE_STATE
  | typeof REJECTED_WITHOUT_PRICE_QUOTE_STATE

export type PricedQuoteState =
  | PendingWithPriceQuoteState
  | AcceptedQuoteState
  | RejectedWithPriceQuoteState

export interface PricedQuoteBody extends Omit<QuoteBody, "state"> {
  state: PricedQuoteState
}
