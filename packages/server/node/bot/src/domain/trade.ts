export interface Trade {
  TradeId: number
  CurrencyPair: string
  TraderName: string
  Notional: number
  DealtCurrency: string
  Direction: string
  Status: string
  SpotRate: number
  TradeDate: string
  ValueDate: string
}

export interface TradeUpdate {
  Trades: Trade[]
  IsStateOfTheWorld: boolean
}
