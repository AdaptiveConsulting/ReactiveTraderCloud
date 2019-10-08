import { CurrencyPair } from '../../../../../rt-types/currencyPair'
import { SpotPriceTick } from './spotPriceTick'

export interface RfqRequest {
  notional: number
  currencyPair: CurrencyPair
}

export interface RfqReceived extends RfqRequest {
  price: SpotPriceTick
  time: number
  timeout: number
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

export interface RfqReset {
  currencyPair: CurrencyPair
}
