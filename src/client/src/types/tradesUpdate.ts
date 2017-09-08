import { Trade } from '.'

export interface TradesUpdate {

  readonly isStateOfTheWorld: boolean
  readonly isStale: boolean
  readonly trades: Trade[]

}
