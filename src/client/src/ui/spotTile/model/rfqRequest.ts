import { CurrencyPair } from '../../../rt-types/currencyPair'

export interface RfqRequest {
  notional: number
  currencyPair: CurrencyPair
}

// Temp
export interface RfqResponse extends RfqRequest {
  price: any
}
