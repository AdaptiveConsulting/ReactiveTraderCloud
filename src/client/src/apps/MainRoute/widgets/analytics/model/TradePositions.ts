export interface CurrencyPairPositionRaw {
  Symbol: string
  BasePnl: number
  BaseTradedAmount: number
  CounterTradedAmount: number
}

export interface PositionsRaw {
  CurrentPositions: CurrencyPairPositionRaw[]
  History: HistoryRaw[]
}

export interface HistoryRaw {
  Timestamp: string
  UsdPnl: number
}
