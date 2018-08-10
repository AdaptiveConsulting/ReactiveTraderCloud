import { PriceMovementTypes } from 'rt-types'

export interface SpotPriceTick {
  ask: number
  bid: number
  mid: number
  creationTimestamp: number
  symbol: string
  valueDate: string
  priceMovementType?: PriceMovementTypes
  priceStale?: boolean
}
