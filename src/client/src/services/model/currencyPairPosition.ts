import CurrencyPair from './currencyPair'

export default class CurrencyPairPosition {
  constructor(symbol: string, basePnl: number, baseTradedAmount: number, currencyPair: CurrencyPair) {
    this._symbol = symbol
    this._currencyPair = currencyPair
    this._basePnl = basePnl
    this._baseTradedAmount = baseTradedAmount
  }

  static get basePnlName() {
    return 'basePnl' // matches basePnl prop name
  }

  static get baseTradedAmountName() {
    return 'baseTradedAmount' // matches baseTradedAmount prop name
  }

  _symbol: string

  get symbol(): string {
    return this._symbol
  }

  _currencyPair: CurrencyPair

  get currencyPair(): CurrencyPair {
    return this._currencyPair
  }

  _basePnl: number

  get basePnl(): number {
    return this._basePnl
  }

  _baseTradedAmount: number

  get baseTradedAmount(): number {
    return this._baseTradedAmount
  }
}
