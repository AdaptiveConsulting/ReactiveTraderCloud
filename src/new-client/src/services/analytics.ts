import { bind } from '@react-rxjs/core'
import { getStream$ } from './client'

interface CurrencyPairPositionRaw {
  Symbol: string
  BasePnl: number
  BaseTradedAmount: number
  CounterTradedAmount: number
}

interface HistoryRaw {
  Timestamp: string
  UsdPnl: number
}

interface PositionsRaw {
  CurrentPositions: CurrencyPairPositionRaw[]
  History: HistoryRaw[]
}

export const [useAnalytics, analytics$] = bind<PositionsRaw>(
  getStream$<PositionsRaw, string>('analytics', 'getAnalitics', 'USD')
)
