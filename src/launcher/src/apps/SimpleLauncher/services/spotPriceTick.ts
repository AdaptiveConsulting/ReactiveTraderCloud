export enum PriceMovementTypes {
  Up = 'Up',
  Down = 'Down',
  None = 'None'
}

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
