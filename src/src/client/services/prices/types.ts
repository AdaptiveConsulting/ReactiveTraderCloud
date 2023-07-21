import { CamelCase } from "../utils"

export interface RawPrice {
  Ask: number
  Bid: number
  Mid: number
  CreationTimestamp: number
  Symbol: string
  ValueDate: string
}

export enum PriceMovementType {
  UP,
  DOWN,
  NONE,
}

export type HistoryPrice = CamelCase<RawPrice>

export interface Price extends HistoryPrice {
  movementType: PriceMovementType
}

export interface Request {
  symbol: string
}
