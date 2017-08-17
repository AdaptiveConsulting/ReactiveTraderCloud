import { Direction } from './index'

export default class ExecuteTradeRequest {
  // note odd casing here as server expects upper camel casing
  CurrencyPair: string
  SpotRate: number
  Direction: Direction
  Notional: number
  DealtCurrency: string

  constructor(currencyPair: string,
              spotRate: number,
              direction: Direction,
              notional: number,
              dealtCurrency: string) {
    this.CurrencyPair = currencyPair
    this.SpotRate = spotRate
    this.Direction = direction
    this.Notional = notional
    this.DealtCurrency = dealtCurrency
  }

  toString(): string {
    return `${this.Direction} ${this.CurrencyPair} (${this.DealtCurrency}) ${this.Notional} @ ${this.SpotRate}`
  }
}
