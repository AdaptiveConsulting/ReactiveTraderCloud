import { CurrencyPair } from './currencyPair'

export interface SpotPriceTick {
  ask: number,
  bid: number,
  mid: number,
  creationTimestamp: number,
  symbol: string
  valueDate: string,
  currencyPair: CurrencyPair
}
