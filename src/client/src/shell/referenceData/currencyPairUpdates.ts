import { CurrencyPair, UpdateType } from 'rt-types'

export interface CurrencyPairUpdate {
  updateType: UpdateType
  currencyPair: CurrencyPair
}

export interface CurrencyPairUpdates {
  isStateOfTheWorld: boolean
  isStale: boolean
  currencyPairUpdates: CurrencyPairUpdate[]
}
