import { CurrencyPair } from "@/services/currencyPairs"
import { Price, PriceMovementType } from "@/services/prices"

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
