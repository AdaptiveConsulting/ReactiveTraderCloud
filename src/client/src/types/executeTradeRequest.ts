import { Direction } from '.'

export interface ExecuteTradeRequest {
  CurrencyPair: string
  SpotRate: number
  Direction: Direction
  Notional: number
  DealtCurrency: string
}
