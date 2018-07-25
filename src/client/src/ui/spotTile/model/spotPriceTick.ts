import { PriceMovementTypes } from '../../../rt-types/priceMovementTypes'

export interface SpotPriceTick {
  ask: number
  bid: number
  mid: number
  creationTimestamp: number
  symbol: string
  valueDate: string
  priceMovementType?: PriceMovementTypes
  priceStale?: boolean
  notification?: any
}
