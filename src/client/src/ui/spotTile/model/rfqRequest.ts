import { CurrencyPair } from '../../../rt-types/currencyPair'

export interface RfqRequest {
  notional: number
  currencyPair: CurrencyPair
}

export interface RfqReceived {
  notional: number
  currencyPair: CurrencyPair
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

// Temp
export interface RfqResponse extends RfqRequest {
  price: any
}
