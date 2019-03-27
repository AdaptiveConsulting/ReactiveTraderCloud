import { CurrencyPair } from '../../../rt-types/currencyPair'

export interface RfqRequest {
  notional: number
  currencyPair: CurrencyPair
}

export interface RfqReceived extends RfqRequest {
  price: number
}

export interface RfqRequote {
  notional: number
  currencyPair: CurrencyPair
}

export interface RfqReject {
  currencyPair: CurrencyPair
}

export interface RfqCancel {
  currencyPair: CurrencyPair
}

export interface RfqExpired {
  currencyPair: CurrencyPair
}
