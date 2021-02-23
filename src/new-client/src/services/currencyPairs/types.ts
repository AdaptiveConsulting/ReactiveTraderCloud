import { CamelCase, CollectionUpdate, CollectionUpdates } from "../utils"

export interface CurrencyRaw {
  Symbol: string
  RatePrecision: number
  PipsPosition: number
}

export interface RawCurrencyPairUpdate extends CollectionUpdate {
  CurrencyPair: CurrencyRaw
}

export interface RawCurrencyPairUpdates extends CollectionUpdates {
  Updates: RawCurrencyPairUpdate[]
}

export interface CurrencyPair extends CamelCase<CurrencyRaw> {
  base: string
  terms: string
}
