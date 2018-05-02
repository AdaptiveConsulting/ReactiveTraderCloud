import { PriceMovementTypes, Rate } from './index'

export interface SpotPrice {
  currencyPair: any
  symbol: any
  ratePrecision: number
  currencyChartIsOpening: boolean
  bid: Rate
  ask: Rate
  mid: Rate
  valueDate: Date
  creationTimestamp: Date
  priceMovementType: PriceMovementTypes
  spread: {
    value: number
    formattedValue: string
  }
  priceStale: boolean
  isTradeExecutionInFlight: boolean
  notification: any
}
