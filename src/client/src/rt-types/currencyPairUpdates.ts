import { CurrencyPairUpdate } from '.'

export interface CurrencyPairUpdates {
  isStateOfTheWorld: boolean
  isStale: boolean
  currencyPairUpdates: CurrencyPairUpdate[]
}
