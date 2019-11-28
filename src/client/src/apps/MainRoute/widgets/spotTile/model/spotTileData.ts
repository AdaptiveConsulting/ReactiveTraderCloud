import { Trade } from 'rt-types'
import { ExecuteTradeRequest } from './executeTradeRequest'
import { SpotPriceTick } from './spotPriceTick'
import { RfqState } from '../components/types'

export interface LastTradeExecutionStatus {
  request: ExecuteTradeRequest
  hasError: boolean
  error?: string
  trade?: Trade
}

export interface SpotTileData {
  isTradeExecutionInFlight: boolean
  price: SpotPriceTick
  historicPrices: SpotPriceTick[]
  lastTradeExecutionStatus: LastTradeExecutionStatus | null
  rfqState: RfqState
  rfqReceivedTime: number | null
  rfqTimeout: number | null
  rfqPrice: SpotPriceTick | null
  notional?: number
}

type SpotTileDataNotional = Pick<SpotTileData, 'notional'>

/**
 `SpotTileData` has optional `notional` field, but notice that `SpotTileDataWithNotional` has required notional field.
 This has been done because we don't know notional when we create `SpotTileData`, default `notional`
 will change from currency to currency.
 We are adding a default `notional` in the spotData selector based on currency (see `spotTile/selectors.ts`).
 I can't say that I like this approach - I would prefer to control this data dependency
 in a high-level reducer. But it would have been much bigger change - resetting reference
 data would need to create new tiles in reducer, then new tiles will need to reset all records in
 `tileData` slice. I'd like to address that some other time and left some TODOs
 */
export type SpotTileDataWithNotional = SpotTileData & Required<SpotTileDataNotional>

export interface CurrencyPairNotional {
  currencyPair: string
  notional: number
}
