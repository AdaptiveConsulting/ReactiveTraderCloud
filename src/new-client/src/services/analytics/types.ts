import { CamelCase } from "services/utils"

export interface CurrencyPairPositionRaw {
  Symbol: string
  BasePnl: number
  BaseTradedAmount: number
  CounterTradedAmount: number
}

export interface CurrencyPairPosition
  extends CamelCase<CurrencyPairPositionRaw> {
  basePnlName: "basePnl"
  baseTradedAmountName: "baseTradedAmount"
}

export interface HistoryRaw {
  Timestamp: string
  UsdPnl: number
}
export interface HistoryEntry {
  timestamp: number
  usPnl: number
}

export interface PositionsRaw {
  CurrentPositions: CurrencyPairPositionRaw[]
  History: HistoryRaw[]
}
