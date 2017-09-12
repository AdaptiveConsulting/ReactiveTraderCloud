import { CurrencyPair, UpdateType } from '.'

export interface CurrencyPairUpdate {
  updateType: UpdateType
  currencyPair: CurrencyPair
}
