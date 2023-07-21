import { CurrencyPair } from "@/client/services/currencyPairs"
import { PriceMovementType } from "@/client/services/prices"

export interface RfqRequest {
  symbol: string
  notional: number
}

export interface RfqResponse {
  notional: number
  currencyPair: CurrencyPair
  price: {
    ask: number
    bid: number
    movementType: PriceMovementType
    mid: number
    creationTimestamp: number
    symbol: string
    valueDate: string
  }
  time: number
  timeout: number
}
